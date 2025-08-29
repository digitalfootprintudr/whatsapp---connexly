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

    // Get vendor information
    const vendorId = (session as any).vendorId;
    if (!vendorId) {
      return NextResponse.json({ error: 'Vendor ID not found' }, { status: 400 });
    }

    // Generate unique session ID for this embedded signup
    const sessionId = `embedded_signup_${vendorId}_${Date.now()}`;

    // Get super admin's WhatsApp Business configuration
    // This would typically come from a global config or super admin settings
    const whatsappConfig = await getWhatsAppBusinessConfig();
    
    if (!whatsappConfig.isConfigured) {
      const missingVars = [];
      if (!whatsappConfig.appId) missingVars.push('FACEBOOK_APP_ID');
      if (!whatsappConfig.appSecret) missingVars.push('FACEBOOK_APP_SECRET');
      if (!whatsappConfig.configId) missingVars.push('WHATSAPP_CONFIG_ID');
      
      return NextResponse.json({ 
        error: `WhatsApp Business API not configured. Missing environment variables: ${missingVars.join(', ')}. Please contact your administrator to configure these settings.` 
      }, { status: 400 });
    }

    // Generate the embedded signup URL using Meta's configuration
    const signupUrl = generateEmbeddedSignupUrl(whatsappConfig, sessionId, vendorId);

    // Store session information for later use
    await storeEmbeddedSignupSession(sessionId, vendorId);

    return NextResponse.json({
      signupUrl,
      sessionId,
      message: 'Embedded signup session created successfully'
    });

  } catch (error) {
    console.error('Error starting embedded signup:', error);
    return NextResponse.json({ 
      error: 'Failed to start embedded signup process' 
    }, { status: 500 });
  }
}

async function getWhatsAppBusinessConfig() {
  // This would fetch from your global WhatsApp Business configuration
  // For now, return a mock configuration
  const config = {
    appId: process.env.FACEBOOK_APP_ID || '',
    appSecret: process.env.FACEBOOK_APP_SECRET || '',
    configId: process.env.WHATSAPP_CONFIG_ID || '',
  };

  const isConfigured = !!(config.appId && config.appSecret && config.configId);
  
  // Log configuration status for debugging
  console.log('WhatsApp Business Config Status:', {
    appId: config.appId ? '✅ Set' : '❌ Missing',
    appSecret: config.appSecret ? '✅ Set' : '❌ Missing', 
    configId: config.configId ? '✅ Set' : '❌ Missing',
    isConfigured
  });

  return {
    ...config,
    isConfigured
  };
}

function generateEmbeddedSignupUrl(config: any, sessionId: string, vendorId: string) {
  // Generate the Meta embedded signup URL
  // This would use Meta's official embedded signup endpoint
  const baseUrl = 'https://www.facebook.com/dialog/oauth';
  const params = new URLSearchParams({
    client_id: config.appId,
    redirect_uri: `${process.env.NEXTAUTH_URL}/api/onboarding/embedded-signup/callback`,
    scope: 'whatsapp_business_management,whatsapp_business_messaging',
    state: sessionId,
    response_type: 'code',
    config_id: config.configId,
    vendor_id: vendorId
  });

  return `${baseUrl}?${params.toString()}`;
}

async function storeEmbeddedSignupSession(sessionId: string, vendorId: string) {
  // Store the session information in your database
  // This helps track the embedded signup process
  // For now, we'll just log it
  console.log(`Storing embedded signup session: ${sessionId} for vendor: ${vendorId}`);
  
  // TODO: Store in database
  // await prisma.embeddedSignupSession.create({
  //   data: {
  //     sessionId,
  //     vendorId,
  //     status: 'PENDING',
  //     createdAt: new Date(),
  //     expiresAt: new Date(Date.now() + 30 * 60 * 1000) // 30 minutes
  //   }
  // });
}
