import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from 'lib/auth';
import { requireRole } from 'lib/rbac';
import { prisma } from '@whatsjet/db/src';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Ensure user is a vendor admin or agent
    requireRole(['VENDOR_ADMIN', 'AGENT']);

    const { searchParams } = new URL(req.url);
    const contactId = searchParams.get('contactId');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (!contactId) {
      return NextResponse.json({ error: 'Contact ID is required' }, { status: 400 });
    }

    // Get the vendor ID from the session or contact
    const contact = await prisma.contact.findUnique({
      where: { id: contactId },
      select: { vendorId: true }
    });

    if (!contact) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
    }

    // Fetch messages with pagination
    const messages = await prisma.message.findMany({
      where: {
        contactId: contactId,
        vendorId: contact.vendorId
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit,
      skip: offset,
      include: {
        contact: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phoneNumber: true
          }
        }
      }
    });

    // Get total count for pagination
    const totalCount = await prisma.message.count({
      where: {
        contactId: contactId,
        vendorId: contact.vendorId
      }
    });

    // Transform messages for frontend
    const transformedMessages = messages.map(message => ({
      id: message.id,
      content: message.content,
      type: message.type,
      direction: message.direction,
      status: message.status,
      timestamp: message.createdAt,
      contact: message.contact
    }));

    return NextResponse.json({
      messages: transformedMessages.reverse(), // Reverse to show oldest first
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount
      }
    });

  } catch (error) {
    console.error('Error fetching chat history:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
