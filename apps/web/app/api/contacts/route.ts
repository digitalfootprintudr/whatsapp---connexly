import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';
import { prisma } from '@whatsjet/db/src';
import { getSessionVendor } from '../../../lib/rbac';

// GET /api/contacts - Get all contacts for the current vendor
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
    const groupId = searchParams.get('groupId');
    const tags = searchParams.get('tags')?.split(',') || [];

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      vendorId,
      isDeleted: false,
    };

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { phoneNumber: { contains: search } },
        { email: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (groupId && groupId !== 'all') {
      where.tags = {
        has: groupId,
      };
    }

    if (tags.length > 0) {
      where.tags = {
        hasSome: tags,
      };
    }

    // Get contacts with pagination
    const [contacts, total] = await Promise.all([
      prisma.contact.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.contact.count({ where }),
    ]);

    // Transform contacts to include tags directly
    const transformedContacts = contacts.map(contact => ({
      id: contact.id,
      phoneNumber: contact.phoneNumber,
      firstName: contact.firstName,
      lastName: contact.lastName,
      email: contact.email,
      company: contact.company,
      tags: contact.tags || [],
      isOptedOut: contact.isOptedOut,
      createdAt: contact.createdAt.toISOString(),
      updatedAt: contact.updatedAt.toISOString(),
    }));

    return NextResponse.json({
      contacts: transformedContacts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/contacts - Create a new contact
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { vendorId } = await getSessionVendor();
    const body = await request.json();
    
    const { phoneNumber, firstName, lastName, email, company, groupIds, tags } = body;

    // Validate required fields
    if (!phoneNumber || !firstName) {
      return NextResponse.json(
        { error: 'Phone number and first name are required' },
        { status: 400 }
      );
    }

    // Check if phone number already exists for this vendor
    const existingContact = await prisma.contact.findFirst({
      where: {
        vendorId,
        phoneNumber,
        isDeleted: false,
      },
    });

    if (existingContact) {
      return NextResponse.json(
        { error: 'Contact with this phone number already exists' },
        { status: 409 }
      );
    }

    // Create contact
    const contact = await prisma.contact.create({
      data: {
        phoneNumber,
        firstName,
        lastName,
        email,
        company,
        tags: tags || [],
        vendorId,
      },
    });

    // Transform response
    const transformedContact = {
      id: contact.id,
      phoneNumber: contact.phoneNumber,
      firstName: contact.firstName,
      lastName: contact.lastName,
      email: contact.email,
      company: contact.company,
      tags: contact.tags || [],
      isOptedOut: contact.isOptedOut,
      createdAt: contact.createdAt.toISOString(),
      updatedAt: contact.updatedAt.toISOString(),
    };

    return NextResponse.json(transformedContact, { status: 201 });
  } catch (error) {
    console.error('Error creating contact:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/contacts - Update a contact
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { vendorId } = await getSessionVendor();
    const body = await request.json();
    
    const { id, phoneNumber, firstName, lastName, email, company, groupIds, tags } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Contact ID is required' },
        { status: 400 }
      );
    }

    // Verify contact belongs to vendor
    const existingContact = await prisma.contact.findFirst({
      where: {
        id,
        vendorId,
        isDeleted: false,
      },
    });

    if (!existingContact) {
      return NextResponse.json(
        { error: 'Contact not found' },
        { status: 404 }
      );
    }

    // Update contact
    const updatedContact = await prisma.contact.update({
      where: { id },
      data: {
        phoneNumber,
        firstName,
        lastName,
        email,
        company,
        tags: tags || [],
        groups: groupIds ? {
          set: groupIds.map((id: string) => ({ id })),
        } : undefined,
      },
      include: {
        groups: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Transform response
    const transformedContact = {
      id: updatedContact.id,
      phoneNumber: updatedContact.phoneNumber,
      firstName: updatedContact.firstName,
      lastName: updatedContact.lastName,
      email: updatedContact.email,
      company: updatedContact.company,
      tags: updatedContact.groups.map(g => g.name),
      isOptedOut: updatedContact.isOptedOut,
      createdAt: updatedContact.createdAt.toISOString(),
      updatedAt: updatedContact.updatedAt.toISOString(),
    };

    return NextResponse.json(transformedContact);
  } catch (error) {
    console.error('Error updating contact:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/contacts - Delete contacts (soft delete)
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { vendorId } = await getSessionVendor();
    const body = await request.json();
    
    const { contactIds } = body;

    if (!contactIds || !Array.isArray(contactIds)) {
      return NextResponse.json(
        { error: 'Contact IDs array is required' },
        { status: 400 }
      );
    }

    // Verify all contacts belong to vendor
    const contacts = await prisma.contact.findMany({
      where: {
        id: { in: contactIds },
        vendorId,
        isDeleted: false,
      },
    });

    if (contacts.length !== contactIds.length) {
      return NextResponse.json(
        { error: 'Some contacts not found or unauthorized' },
        { status: 404 }
      );
    }

    // Soft delete contacts
    await prisma.contact.updateMany({
      where: {
        id: { in: contactIds },
        vendorId,
      },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });

    return NextResponse.json({ message: 'Contacts deleted successfully' });
  } catch (error) {
    console.error('Error deleting contacts:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

