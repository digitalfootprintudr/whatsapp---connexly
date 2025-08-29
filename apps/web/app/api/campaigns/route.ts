import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';
import { prisma } from '@whatsjet/db/src';
import { getSessionVendor } from '../../../lib/rbac';

// GET /api/campaigns - Get all campaigns for the current vendor
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { vendorId } = await getSessionVendor();
    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status');

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      vendorId,
      // Remove isDeleted filter since Campaign model doesn't have this field
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (status && status !== 'all') {
      where.status = status;
    }

    // Get campaigns with pagination
    const [campaigns, total] = await Promise.all([
      prisma.campaign.findMany({
        where,
        include: {
          vendor: true,
          logs: true,
          targets: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.campaign.count({ where }),
    ]);

    // Transform campaigns to include all necessary data
    const transformedCampaigns = campaigns.map(campaign => ({
      id: campaign.id,
      name: campaign.name,
      status: campaign.status,
      scheduledAt: campaign.scheduledAt?.toISOString(),
      createdAt: campaign.createdAt.toISOString(),
      updatedAt: campaign.updatedAt.toISOString(),
      isDeleted: campaign.isDeleted,
      description: campaign.description,
      type: campaign.type,
      targetAudience: campaign.targetAudience,
      message: campaign.message,
      schedule: campaign.schedule,
      stats: campaign.stats,
      vendor: campaign.vendor,
      logs: campaign.logs,
      targets: campaign.targets,
    }));

    return NextResponse.json({
      campaigns: transformedCampaigns,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/campaigns - Create a new campaign
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { vendorId } = await getSessionVendor();
    const body = await request.json();
    
    const { 
      name, 
      description, 
      type, 
      targetAudience, 
      message, 
      schedule 
    } = body;

    // Validate required fields
    if (!name || !type || !targetAudience || !message) {
      return NextResponse.json(
        { error: 'Name, type, target audience, and message are required' },
        { status: 400 }
      );
    }

    // Create campaign with related data
    const campaign = await prisma.campaign.create({
      data: {
        name,
        description,
        type,
        status: 'DRAFT',
        vendorId,
        targetAudience: {
          create: {
            type: targetAudience.type,
            value: targetAudience.value,
          },
        },
        message: {
          create: {
            text: message.text,
            templateId: message.templateId,
            flowId: message.flowId,
            mediaUrl: message.mediaUrl,
          },
        },
        schedule: {
          create: {
            type: schedule.type,
            scheduledAt: schedule.scheduledAt ? new Date(schedule.scheduledAt) : null,
            recurringPattern: schedule.recurringPattern,
          },
        },
        stats: {
          create: {
            totalContacts: 0,
            sent: 0,
            delivered: 0,
            read: 0,
            failed: 0,
            pending: 0,
          },
        },
      },
      include: {
        targetAudience: true,
        message: true,
        schedule: true,
        stats: true,
      },
    });

    // Transform response
    const transformedCampaign = {
      id: campaign.id,
      name: campaign.name,
      description: campaign.description,
      status: campaign.status,
      type: campaign.type,
      targetAudience: {
        type: campaign.targetAudience.type,
        value: campaign.targetAudience.value,
      },
      message: {
        text: campaign.message.text,
        templateId: campaign.message.templateId,
        flowId: campaign.message.flowId,
        mediaUrl: campaign.message.mediaUrl,
      },
      schedule: {
        type: campaign.schedule.type,
        scheduledAt: campaign.schedule.scheduledAt?.toISOString(),
        recurringPattern: campaign.schedule.recurringPattern,
      },
      stats: {
        totalContacts: campaign.stats.totalContacts,
        sent: campaign.stats.sent,
        delivered: campaign.stats.delivered,
        read: campaign.stats.read,
        failed: campaign.stats.failed,
        pending: campaign.stats.pending,
      },
      createdAt: campaign.createdAt.toISOString(),
      updatedAt: campaign.updatedAt.toISOString(),
    };

    return NextResponse.json(transformedCampaign, { status: 201 });
  } catch (error) {
    console.error('Error creating campaign:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/campaigns - Update a campaign
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { vendorId } = await getSessionVendor();
    const body = await request.json();
    
    const { 
      id, 
      name, 
      description, 
      type, 
      targetAudience, 
      message, 
      schedule 
    } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Campaign ID is required' },
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
    });

    if (!existingCampaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      );
    }

    // Only allow updates for DRAFT campaigns
    if (existingCampaign.status !== 'DRAFT') {
      return NextResponse.json(
        { error: 'Only draft campaigns can be updated' },
        { status: 400 }
      );
    }

    // Update campaign and related data
    const updatedCampaign = await prisma.campaign.update({
      where: { id },
      data: {
        name,
        description,
        type,
        targetAudience: {
          update: {
            type: targetAudience.type,
            value: targetAudience.value,
          },
        },
        message: {
          update: {
            text: message.text,
            templateId: message.templateId,
            flowId: message.flowId,
            mediaUrl: message.mediaUrl,
          },
        },
        schedule: {
          update: {
            type: schedule.type,
            scheduledAt: schedule.scheduledAt ? new Date(schedule.scheduledAt) : null,
            recurringPattern: schedule.recurringPattern,
          },
        },
      },
      include: {
        targetAudience: true,
        message: true,
        schedule: true,
        stats: true,
      },
    });

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
    console.error('Error updating campaign:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/campaigns - Delete campaigns (soft delete)
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { vendorId } = await getSessionVendor();
    const body = await request.json();
    
    const { campaignIds } = body;

    if (!campaignIds || !Array.isArray(campaignIds)) {
      return NextResponse.json(
        { error: 'Campaign IDs array is required' },
        { status: 400 }
      );
    }

    // Verify all campaigns belong to vendor
    const campaigns = await prisma.campaign.findMany({
      where: {
        id: { in: campaignIds },
        vendorId,
        isDeleted: false,
      },
    });

    if (campaigns.length !== campaignIds.length) {
      return NextResponse.json(
        { error: 'Some campaigns not found or unauthorized' },
        { status: 404 }
      );
    }

    // Only allow deletion of DRAFT campaigns
    const nonDraftCampaigns = campaigns.filter(c => c.status !== 'DRAFT');
    if (nonDraftCampaigns.length > 0) {
      return NextResponse.json(
        { error: 'Only draft campaigns can be deleted' },
        { status: 400 }
      );
    }

    // Soft delete campaigns
    await prisma.campaign.updateMany({
      where: {
        id: { in: campaignIds },
        vendorId,
      },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });

    return NextResponse.json({ message: 'Campaigns deleted successfully' });
  } catch (error) {
    console.error('Error deleting campaigns:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
