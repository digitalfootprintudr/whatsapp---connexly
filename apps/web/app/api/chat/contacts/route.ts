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
    const search = searchParams.get('search') || '';
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Get vendor ID from session (you might need to adjust this based on your session structure)
    const vendorId = (session as any).vendorId;
    if (!vendorId) {
      return NextResponse.json({ error: 'Vendor ID not found in session' }, { status: 400 });
    }

    // Build search filter
    const searchFilter = search ? {
      OR: [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { phoneNumber: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ]
    } : {};

    // Fetch contacts with their last message and unread count
    const contacts = await prisma.contact.findMany({
      where: {
        vendorId: vendorId,
        isDeleted: false,
        ...searchFilter
      },
      orderBy: {
        updatedAt: 'desc'
      },
      take: limit,
      skip: offset,
      include: {
        messages: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 1,
          select: {
            id: true,
            content: true,
            direction: true,
            createdAt: true,
            status: true
          }
        },
        _count: {
          select: {
            messages: {
              where: {
                direction: 'INBOUND',
                status: 'DELIVERED'
              }
            }
          }
        }
      }
    });

    // Transform contacts for frontend
    const transformedContacts = contacts.map(contact => {
      const lastMessage = contact.messages[0];
      const unreadCount = contact._count.messages;

      return {
        id: contact.id,
        phoneNumber: contact.phoneNumber,
        firstName: contact.firstName,
        lastName: contact.lastName,
        email: contact.email,
        company: contact.company,
        lastMessage: lastMessage ? {
          content: lastMessage.content,
          direction: lastMessage.direction,
          timestamp: lastMessage.createdAt,
          status: lastMessage.status
        } : null,
        unreadCount: unreadCount,
        isOnline: false, // This would need to be implemented with presence system
        lastActivity: lastMessage?.createdAt || contact.updatedAt
      };
    });

    // Get total count for pagination
    const totalCount = await prisma.contact.count({
      where: {
        vendorId: vendorId,
        isDeleted: false,
        ...searchFilter
      }
    });

    return NextResponse.json({
      contacts: transformedContacts,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount
      }
    });

  } catch (error) {
    console.error('Error fetching chat contacts:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
