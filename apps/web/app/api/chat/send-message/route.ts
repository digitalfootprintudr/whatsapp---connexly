import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from 'lib/auth';
import { requireRole } from 'lib/rbac';
import { prisma } from '@whatsjet/db/src';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Ensure user is a vendor admin or agent
    requireRole(['VENDOR_ADMIN', 'AGENT']);

    const { contactId, message, messageType = 'TEXT' } = await req.json();

    if (!contactId || !message) {
      return NextResponse.json({ error: 'Contact ID and message are required' }, { status: 400 });
    }

    // Get the contact and vendor information
    const contact = await prisma.contact.findUnique({
      where: { id: contactId },
      include: { vendor: true }
    });

    if (!contact) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
    }

    if (!contact.vendor.wabaId || !contact.vendor.phoneNumberId || !contact.vendor.accessToken) {
      return NextResponse.json({ 
        error: 'WhatsApp Business API not configured. Please complete the setup first.' 
      }, { status: 400 });
    }

    // Create message record in database
    const dbMessage = await prisma.message.create({
      data: {
        vendorId: contact.vendorId,
        contactId: contactId,
        direction: 'OUTBOUND',
        type: messageType,
        content: { text: message },
        status: 'PENDING'
      }
    });

    // Send message via WhatsApp Business API
    const whatsappResponse = await sendWhatsAppMessage({
      phoneNumberId: contact.vendor.phoneNumberId,
      accessToken: contact.vendor.accessToken,
      to: contact.phoneNumber,
      message: message,
      messageType: messageType
    });

    if (whatsappResponse.success) {
      // Update message status to sent and store WhatsApp message ID
      await prisma.message.update({
        where: { id: dbMessage.id },
        data: { 
          status: 'SENT',
          whatsappMessageId: whatsappResponse.messageId
        }
      });

      return NextResponse.json({ 
        success: true, 
        messageId: dbMessage.id,
        whatsappMessageId: whatsappResponse.messageId 
      });
    } else {
      // Update message status to failed
      await prisma.message.update({
        where: { id: dbMessage.id },
        data: { 
          status: 'FAILED',
          content: { 
            ...dbMessage.content as any, 
            error: whatsappResponse.error 
          }
        }
      });

      return NextResponse.json({ 
        error: 'Failed to send message via WhatsApp', 
        details: whatsappResponse.error 
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function sendWhatsAppMessage({
  phoneNumberId,
  accessToken,
  to,
  message,
  messageType
}: {
  phoneNumberId: string;
  accessToken: string;
  to: string;
  message: string;
  messageType: string;
}) {
  try {
    // Format phone number (remove + and add country code if needed)
    const formattedPhone = formatPhoneNumber(to);
    
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: formattedPhone,
          type: messageType.toLowerCase(),
          text: { body: message }
        })
      }
    );

    const data = await response.json();

    if (response.ok && data.messages && data.messages[0]) {
      return {
        success: true,
        messageId: data.messages[0].id
      };
    } else {
      console.error('WhatsApp API error:', data);
      return {
        success: false,
        error: data.error?.message || 'Unknown error from WhatsApp API'
      };
    }
  } catch (error) {
    console.error('Error calling WhatsApp API:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

function formatPhoneNumber(phoneNumber: string): string {
  // Remove any non-digit characters except +
  let cleaned = phoneNumber.replace(/[^\d+]/g, '');
  
  // If it starts with +, keep it
  if (cleaned.startsWith('+')) {
    return cleaned;
  }
  
  // If it's 10 digits (US number), add +1
  if (cleaned.length === 10) {
    return `+1${cleaned}`;
  }
  
  // If it's 11 digits and starts with 1, add +
  if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return `+${cleaned}`;
  }
  
  // Otherwise, assume it's already formatted correctly
  return cleaned;
}
