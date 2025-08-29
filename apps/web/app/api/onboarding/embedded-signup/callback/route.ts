import { NextRequest, NextResponse } from 'next/server';
import { redirect } from 'next/navigation';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');
    const errorReason = searchParams.get('error_reason');

    if (error) {
      console.error('Embedded signup error:', { error, errorReason, state });
      return redirect(`/onboarding/start?error=${encodeURIComponent(errorReason || 'Unknown error')}`);
    }

    if (!code || !state) {
      return redirect('/onboarding/start?error=Missing authorization code');
    }

    // Parse the state parameter to get session information
    const [sessionId, vendorId] = parseState(state);
    
    if (!sessionId || !vendorId) {
      return redirect('/onboarding/start?error=Invalid session state');
    }

    // Exchange the authorization code for access token
    const tokenResponse = await exchangeCodeForToken(code, state);
    
    if (!tokenResponse.success) {
      return redirect(`/onboarding/start?error=${encodeURIComponent(tokenResponse.error)}`);
    }

    // Get WhatsApp Business Account information
    const wabaInfo = await getWhatsAppBusinessInfo(tokenResponse.accessToken);
    
    if (!wabaInfo.success) {
      return redirect(`/onboarding/start?error=${encodeURIComponent(wabaInfo.error)}`);
    }

    // Complete the embedded signup process
    const completionResult = await completeEmbeddedSignup(
      sessionId, 
      vendorId, 
      tokenResponse.accessToken,
      wabaInfo.data
    );

    if (!completionResult.success) {
      return redirect(`/onboarding/start?error=${encodeURIComponent(completionResult.error)}`);
    }

    // Redirect to success page with completion data
    const successUrl = `/onboarding/success?sessionId=${sessionId}&vendorId=${vendorId}`;
    return redirect(successUrl);

  } catch (error) {
    console.error('Error in embedded signup callback:', error);
    return redirect('/onboarding/start?error=Unexpected error occurred');
  }
}

function parseState(state: string): [string, string] {
  // State format: embedded_signup_{vendorId}_{timestamp}
  const parts = state.split('_');
  if (parts.length >= 3) {
    const vendorId = parts[2];
    const timestamp = parts[3];
    return [`${parts[0]}_${parts[1]}_${timestamp}`, vendorId];
  }
  return ['', ''];
}

async function exchangeCodeForToken(code: string, state: string) {
  try {
    const tokenUrl = 'https://graph.facebook.com/v18.0/oauth/access_token';
    const params = new URLSearchParams({
      client_id: process.env.FACEBOOK_APP_ID!,
      client_secret: process.env.FACEBOOK_APP_SECRET!,
      redirect_uri: `${process.env.NEXTAUTH_URL}/api/onboarding/embedded-signup/callback`,
      code,
      state
    });

    const response = await fetch(`${tokenUrl}?${params.toString()}`);
    const data = await response.json();

    if (data.error) {
      return {
        success: false,
        error: data.error.message || 'Failed to exchange code for token'
      };
    }

    return {
      success: true,
      accessToken: data.access_token,
      expiresIn: data.expires_in
    };

  } catch (error) {
    console.error('Error exchanging code for token:', error);
    return {
      success: false,
      error: 'Failed to exchange authorization code'
    };
  }
}

async function getWhatsAppBusinessInfo(accessToken: string) {
  try {
    // Get user's WhatsApp Business Accounts
    const wabaUrl = 'https://graph.facebook.com/v18.0/me/whatsapp_business_accounts';
    const response = await fetch(`${wabaUrl}?access_token=${accessToken}`);
    const data = await response.json();

    if (data.error) {
      return {
        success: false,
        error: data.error.message || 'Failed to get WhatsApp Business Account info'
      };
    }

    // Get the first WABA (or let user choose if multiple)
    const waba = data.data?.[0];
    if (!waba) {
      return {
        success: false,
        error: 'No WhatsApp Business Account found'
      };
    }

    // Get phone numbers for this WABA
    const phoneNumbersUrl = `https://graph.facebook.com/v18.0/${waba.id}/phone_numbers`;
    const phoneResponse = await fetch(`${phoneNumbersUrl}?access_token=${accessToken}`);
    const phoneData = await phoneResponse.json();

    if (phoneData.error) {
      return {
        success: false,
        error: phoneData.error.message || 'Failed to get phone numbers'
      };
    }

    const phoneNumber = phoneData.data?.[0];
    if (!phoneNumber) {
      return {
        success: false,
        error: 'No phone numbers found for WhatsApp Business Account'
      };
    }

    return {
      success: true,
      data: {
        wabaId: waba.id,
        wabaName: waba.name,
        phoneNumberId: phoneNumber.id,
        phoneNumber: phoneNumber.phone_number,
        displayName: phoneNumber.display_name,
        verifiedName: phoneNumber.verified_name,
        businessName: waba.name
      }
    };

  } catch (error) {
    console.error('Error getting WhatsApp Business info:', error);
    return {
      success: false,
      error: 'Failed to retrieve WhatsApp Business Account information'
    };
  }
}

async function completeEmbeddedSignup(
  sessionId: string, 
  vendorId: string, 
  accessToken: string, 
  wabaInfo: any
) {
  try {
    // Update the vendor's WhatsApp Business configuration
    const updateResponse = await fetch(`${process.env.NEXTAUTH_URL}/api/settings/whatsapp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        metaAppId: process.env.FACEBOOK_APP_ID,
        wabaId: wabaInfo.wabaId,
        phoneNumberId: wabaInfo.phoneNumberId,
        accessToken: accessToken,
        webhookUrl: `${process.env.NEXTAUTH_URL}/api/webhooks/whatsapp/${vendorId}`,
        webhookVerifyToken: generateWebhookVerifyToken(),
        businessName: wabaInfo.businessName,
        phoneNumber: wabaInfo.phoneNumber,
        displayName: wabaInfo.displayName
      })
    });

    if (!updateResponse.ok) {
      const error = await updateResponse.json();
      return {
        success: false,
        error: error.message || 'Failed to update vendor configuration'
      };
    }

    // Mark embedded signup session as completed
    await markEmbeddedSignupComplete(sessionId, vendorId);

    return {
      success: true,
      message: 'WhatsApp Business integration completed successfully'
    };

  } catch (error) {
    console.error('Error completing embedded signup:', error);
    return {
      success: false,
      error: 'Failed to complete embedded signup process'
    };
  }
}

function generateWebhookVerifyToken(): string {
  // Generate a secure random token for webhook verification
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

async function markEmbeddedSignupComplete(sessionId: string, vendorId: string) {
  // Mark the embedded signup session as completed
  console.log(`Marking embedded signup complete: ${sessionId} for vendor: ${vendorId}`);
  
  // TODO: Update database
  // await prisma.embeddedSignupSession.update({
  //   where: { sessionId },
  //   data: {
  //     status: 'COMPLETED',
  //     completedAt: new Date()
  //   }
  // });
}
