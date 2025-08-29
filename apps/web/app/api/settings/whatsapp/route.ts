import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';
import { requireRole } from '../../../lib/rbac';
import { prisma } from '@whatsjet/db/src';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Ensure user is a vendor admin
    requireRole(['VENDOR_ADMIN']);

    const body = await req.json();
    const {
      metaAppId,
      metaAppSecret,
      wabaId,
      phoneNumberId,
      accessToken,
      webhookUrl,
      webhookVerifyToken,
    } = body;

    // Validate required fields
    if (!metaAppId || !wabaId || !phoneNumberId || !accessToken) {
      return NextResponse.json(
        { error: 'Missing required fields: metaAppId, wabaId, phoneNumberId, accessToken' },
        { status: 400 }
      );
    }

    // Update vendor's WhatsApp configuration
    const updatedVendor = await prisma.vendor.update({
      where: { id: (session as any).vendorId },
      data: {
        metaAppId,
        metaAppSecret: metaAppSecret || null, // Optional field
        wabaId,
        phoneNumberId,
        accessToken,
        webhookUrl: webhookUrl || null,
        webhookVerifyToken: webhookVerifyToken || null,
        updatedAt: new Date(),
      },
    });

    // Remove sensitive data from response
    const { metaAppSecret: _, accessToken: __, ...safeVendor } = updatedVendor;

    return NextResponse.json({
      message: 'WhatsApp Business configuration updated successfully',
      vendor: safeVendor,
    });

  } catch (error) {
    console.error('Error updating WhatsApp configuration:', error);
    
    if (error instanceof Error && error.message === 'Forbidden') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Ensure user is a vendor admin
    requireRole(['VENDOR_ADMIN']);

    // Get vendor's current WhatsApp configuration
    const vendor = await prisma.vendor.findUnique({
      where: { id: (session as any).vendorId },
      select: {
        id: true,
        name: true,
        metaAppId: true,
        wabaId: true,
        phoneNumberId: true,
        webhookUrl: true,
        webhookVerifyToken: true,
        // Don't include sensitive fields like metaAppSecret and accessToken
      },
    });

    if (!vendor) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
    }

    return NextResponse.json({ vendor });

  } catch (error) {
    console.error('Error fetching WhatsApp configuration:', error);
    
    if (error instanceof Error && error.message === 'Forbidden') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
