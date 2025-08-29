import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import { requireRole } from '../../../../lib/rbac';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    requireRole(['VENDOR_ADMIN']);

    const { accessToken, phoneNumberId, webhookUrl, webhookVerifyToken } = await req.json();

    if (!accessToken || !phoneNumberId || !webhookUrl || !webhookVerifyToken) {
      return NextResponse.json({ 
        error: 'Missing required parameters: accessToken, phoneNumberId, webhookUrl, webhookVerifyToken' 
      }, { status: 400 });
    }

    // Configure webhook with Meta
    const webhookConfigResult = await configureWebhookWithMeta(
      accessToken, 
      phoneNumberId, 
      webhookUrl, 
      webhookVerifyToken
    );

    if (!webhookConfigResult.success) {
      return NextResponse.json({ 
        error: webhookConfigResult.error 
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: 'Webhook configured successfully with Meta',
      webhookUrl,
      webhookVerifyToken,
      metaResponse: webhookConfigResult.metaResponse
    });

  } catch (error) {
    console.error('Error configuring webhook:', error);
    return NextResponse.json({ 
      error: 'Failed to configure webhook' 
    }, { status: 500 });
  }
}

async function configureWebhookWithMeta(
  accessToken: string, 
  phoneNumberId: string, 
  webhookUrl: string, 
  webhookVerifyToken: string
) {
  try {
    // Step 1: Set webhook URL with Meta
    const webhookUrlResponse = await fetch(
      `https://graph.facebook.com/v18.0/${phoneNumberId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_token: accessToken,
          webhook_url: webhookUrl,
          webhook_verify_token: webhookVerifyToken
        }),
      }
    );

    const webhookUrlData = await webhookUrlResponse.json();

    if (webhookUrlData.error) {
      console.error('Meta webhook URL configuration error:', webhookUrlData.error);
      return {
        success: false,
        error: `Failed to set webhook URL: ${webhookUrlData.error.message}`
      };
    }

    // Step 2: Subscribe to webhook events
    const subscribeResponse = await fetch(
      `https://graph.facebook.com/v18.0/${phoneNumberId}/subscribed_apps`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_token: accessToken,
          subscribed_fields: 'messages,message_deliveries,message_reads'
        }),
      }
    );

    const subscribeData = await subscribeResponse.json();

    if (subscribeData.error) {
      console.error('Meta webhook subscription error:', subscribeData.error);
      return {
        success: false,
        error: `Failed to subscribe to webhook events: ${subscribeData.error.message}`
      };
    }

    // Step 3: Verify webhook configuration
    const verifyResponse = await fetch(
      `https://graph.facebook.com/v18.0/${phoneNumberId}?fields=webhook_url,webhook_verify_token&access_token=${accessToken}`
    );

    const verifyData = await verifyResponse.json();

    if (verifyData.error) {
      console.error('Meta webhook verification error:', verifyData.error);
      return {
        success: false,
        error: `Failed to verify webhook configuration: ${verifyData.error.message}`
      };
    }

    // Log successful configuration
    console.log('Webhook configured successfully with Meta:', {
      phoneNumberId,
      webhookUrl,
      webhookVerifyToken,
      metaResponse: {
        webhookUrl: verifyData.webhook_url,
        webhookVerifyToken: verifyData.webhook_verify_token
      }
    });

    return {
      success: true,
      metaResponse: {
        webhookUrl: verifyData.webhook_url,
        webhookVerifyToken: verifyData.webhook_verify_token
      }
    };

  } catch (error) {
    console.error('Error in configureWebhookWithMeta:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}
