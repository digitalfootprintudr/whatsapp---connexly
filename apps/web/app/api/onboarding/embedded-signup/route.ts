import { NextRequest } from 'next/server';

// Returns the Facebook Embedded Signup URL parameters for the client
export async function GET() {
  const appId = process.env.META_APP_ID;
  const redirectUri = `${process.env.APP_URL}/onboarding/callback`;
  if (!appId) {
    return Response.json({ error: 'META_APP_ID missing' }, { status: 500 });
  }
  const url = `https://www.facebook.com/v20.0/dialog/oauth?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=whatsapp_business_management,whatsapp_business_messaging,business_management`;
  return Response.json({ url });
}

// Handle the final step with code exchange will be on callback route
export async function POST(req: NextRequest) {
  return Response.json({ ok: true });
}

