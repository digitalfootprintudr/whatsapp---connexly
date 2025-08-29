import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@whatsjet/db/src';

export async function GET(
  req: NextRequest,
  { params }: { params: { vendorId: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const mode = searchParams.get('hub.mode');
    const token = searchParams.get('hub.verify_token');
    const challenge = searchParams.get('hub.challenge');

    // Webhook verification
    if (mode === 'subscribe' && token) {
      // Get vendor's webhook verify token
      const vendor = await prisma.vendor.findUnique({
        where: { id: params.vendorId },
        select: { webhookVerifyToken: true }
      });

      if (!vendor || vendor.webhookVerifyToken !== token) {
        console.error('Webhook verification failed: Invalid token for vendor:', params.vendorId);
        return new NextResponse('Forbidden', { status: 403 });
      }

      console.log('Webhook verified successfully for vendor:', params.vendorId);
      return new NextResponse(challenge, { status: 200 });
    }

    return new NextResponse('Forbidden', { status: 403 });

  } catch (error) {
    console.error('Webhook verification error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { vendorId: string } }
) {
  try {
    const body = await req.json();
    console.log('Webhook received for vendor:', params.vendorId, body);

    // Handle different webhook events
    if (body.object === 'whatsapp_business_account') {
      for (const entry of body.entry) {
        for (const change of entry.changes) {
          if (change.value) {
            await handleWebhookEvent(params.vendorId, change.value);
          }
        }
      }
    }

    return new NextResponse('OK', { status: 200 });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

async function handleWebhookEvent(vendorId: string, value: any) {
  try {
    // Handle messages
    if (value.messages) {
      for (const message of value.messages) {
        await processIncomingMessage(vendorId, message);
      }
    }

    // Handle message deliveries
    if (value.message_deliveries) {
      for (const delivery of value.message_deliveries) {
        await processMessageDelivery(vendorId, delivery);
      }
    }

    // Handle message reads
    if (value.message_reads) {
      for (const read of value.message_reads) {
        await processMessageRead(vendorId, read);
      }
    }

  } catch (error) {
    console.error('Error handling webhook event:', error);
  }
}

async function processIncomingMessage(vendorId: string, message: any) {
  try {
    console.log('Processing incoming message:', {
      vendorId,
      messageId: message.id,
      from: message.from,
      timestamp: message.timestamp,
      type: message.type
    });

    // Find or create contact
    let contact = await prisma.contact.findFirst({
      where: {
        vendorId: vendorId,
        phoneNumber: message.from
      }
    });

    if (!contact) {
      // Create new contact if doesn't exist
      contact = await prisma.contact.create({
        data: {
          vendorId: vendorId,
          phoneNumber: message.from,
          firstName: 'Unknown',
          lastName: 'Contact'
        }
      });
      console.log('Created new contact:', contact.id);
    }

    // Prepare message content based on type
    let messageContent: any = {};
    let messageType = 'TEXT';

    switch (message.type) {
      case 'text':
        messageContent = { text: message.text?.body || '' };
        messageType = 'TEXT';
        break;
      case 'image':
        messageContent = {
          image: {
            id: message.image?.id,
            mime_type: message.image?.mime_type,
            sha256: message.image?.sha256,
            caption: message.image?.caption
          }
        };
        messageType = 'IMAGE';
        break;
      case 'document':
        messageContent = {
          document: {
            id: message.document?.id,
            filename: message.document?.filename,
            mime_type: message.document?.mime_type,
            sha256: message.document?.sha256
          }
        };
        messageType = 'DOCUMENT';
        break;
      case 'audio':
        messageContent = {
          audio: {
            id: message.audio?.id,
            mime_type: message.audio?.mime_type,
            sha256: message.audio?.sha256,
            voice: message.audio?.voice
          }
        };
        messageType = 'AUDIO';
        break;
      case 'video':
        messageContent = {
          video: {
            id: message.video?.id,
            mime_type: message.video?.mime_type,
            sha256: message.video?.sha256,
            caption: message.video?.caption
          }
        };
        messageType = 'VIDEO';
        break;
      default:
        messageContent = { text: 'Unsupported message type' };
        messageType = 'TEXT';
    }

    // Store message in database
    const dbMessage = await prisma.message.create({
      data: {
        vendorId: vendorId,
        contactId: contact.id,
        direction: 'INBOUND',
        type: messageType,
        content: messageContent,
        status: 'DELIVERED' // Incoming messages are considered delivered
      }
    });

    console.log('Stored incoming message in database:', dbMessage.id);

    // TODO: Trigger any automated responses or workflows
    // TODO: Send real-time notification to connected clients

  } catch (error) {
    console.error('Error processing incoming message:', error);
  }
}

async function processMessageDelivery(vendorId: string, delivery: any) {
  try {
    console.log('Processing message delivery:', {
      vendorId,
      messageId: delivery.id,
      status: delivery.status,
      timestamp: delivery.timestamp
    });

    // Find the message by WhatsApp message ID
    const message = await prisma.message.findFirst({
      where: {
        vendorId: vendorId,
        whatsappMessageId: delivery.id
      }
    });

    if (message) {
      // Update message status in database
      await prisma.message.update({
        where: { id: message.id },
        data: { status: 'DELIVERED' }
      });
      console.log('Updated message status to DELIVERED:', message.id);
    } else {
      console.log('Message not found for delivery update:', delivery.id);
    }

    // TODO: Send real-time notification to connected clients

  } catch (error) {
    console.error('Error processing message delivery:', error);
  }
}

async function processMessageRead(vendorId: string, read: any) {
  try {
    console.log('Processing message read:', {
      vendorId,
      messageId: read.id,
      timestamp: read.timestamp
    });

    // Find the message by WhatsApp message ID
    const message = await prisma.message.findFirst({
      where: {
        vendorId: vendorId,
        whatsappMessageId: read.id
      }
    });

    if (message) {
      // Update message read status in database
      await prisma.message.update({
        where: { id: message.id },
        data: { status: 'READ' }
      });
      console.log('Updated message status to READ:', message.id);
    } else {
      console.log('Message not found for read update:', read.id);
    }

    // TODO: Send real-time notification to connected clients

  } catch (error) {
    console.error('Error processing message read:', error);
  }
}
