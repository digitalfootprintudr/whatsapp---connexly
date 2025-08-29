import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../../lib/auth';
import { prisma } from '@whatsjet/db/src';
import { getSessionVendor } from '../../../../../lib/rbac';

// PATCH /api/campaigns/[id]/status - Update campaign status
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { vendorId } = await getSessionVendor();
    const { id } = params;
    const body = await request.json();
    
    const { status: newStatus } = body;

    if (!newStatus) {
      return NextResponse.json(
        { error: 'New status is required' },
        { status: 400 }
      );
    }

    // Validate status values
    const validStatuses = ['DRAFT', 'SCHEDULED', 'RUNNING', 'PAUSED', 'COMPLETED', 'FAILED'];
    if (!validStatuses.includes(newStatus)) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      );
    }

    // Verify campaign belongs to vendor
    const existingCampaign = await prisma.campaign.findFirst({
      where: {
        id,
        vendorId,
        isDeleted: false,
      },
      include: {
        targetAudience: true,
        message: true,
        schedule: true,
        stats: true,
      },
    });

    if (!existingCampaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      );
    }

    // Validate status transitions
    const currentStatus = existingCampaign.status;
    const allowedTransitions: Record<string, string[]> = {
      'DRAFT': ['SCHEDULED', 'RUNNING'],
      'SCHEDULED': ['RUNNING', 'DRAFT'],
      'RUNNING': ['PAUSED', 'COMPLETED', 'FAILED'],
      'PAUSED': ['RUNNING', 'COMPLETED', 'FAILED'],
      'COMPLETED': [],
      'FAILED': ['RUNNING'],
    };

    if (!allowedTransitions[currentStatus].includes(newStatus)) {
      return NextResponse.json(
        { error: `Cannot transition from ${currentStatus} to ${newStatus}` },
        { status: 400 }
      );
    }

    // Update campaign status
    const updatedCampaign = await prisma.campaign.update({
      where: { id },
      data: {
        status: newStatus,
        // If starting a campaign, set start time
        ...(newStatus === 'RUNNING' && { startedAt: new Date() }),
        // If completing or failing, set end time
        ...((newStatus === 'COMPLETED' || newStatus === 'FAILED') && { endedAt: new Date() }),
      },
      include: {
        targetAudience: true,
        message: true,
        schedule: true,
        stats: true,
      },
    });

    // If starting a campaign, add it to the queue
    if (newStatus === 'RUNNING') {
      // TODO: Add to BullMQ queue for processing
      console.log(`Campaign ${id} added to processing queue`);
    }

    // Transform response
    const transformedCampaign = {
      id: updatedCampaign.id,
      name: updatedCampaign.name,
      description: updatedCampaign.description,
      status: updatedCampaign.status,
      type: updatedCampaign.type,
      targetAudience: {
        type: updatedCampaign.targetAudience.type,
        value: updatedCampaign.targetAudience.value,
      },
      message: {
        text: updatedCampaign.message.text,
        templateId: updatedCampaign.message.templateId,
        flowId: updatedCampaign.message.flowId,
        mediaUrl: updatedCampaign.message.mediaUrl,
      },
      schedule: {
        type: updatedCampaign.schedule.type,
        scheduledAt: updatedCampaign.schedule.scheduledAt?.toISOString(),
        recurringPattern: updatedCampaign.schedule.recurringPattern,
      },
      stats: {
        totalContacts: updatedCampaign.stats.totalContacts,
        sent: updatedCampaign.stats.sent,
        delivered: updatedCampaign.stats.delivered,
        read: updatedCampaign.stats.read,
        failed: updatedCampaign.stats.failed,
        pending: updatedCampaign.stats.pending,
      },
      createdAt: updatedCampaign.createdAt.toISOString(),
      updatedAt: updatedCampaign.updatedAt.toISOString(),
    };

    return NextResponse.json(transformedCampaign);
  } catch (error) {
    console.error('Error updating campaign status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
