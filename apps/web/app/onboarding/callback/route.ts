import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  if (!code) return Response.redirect(new URL('/settings/whatsapp?error=missing_code', req.url));

  // Exchange code for token via Graph API
  // Note: Full flow includes business creation, WABA and phone setup. Placeholder here.
  try {
    // TODO: Implement token exchange and store vendor credentials
    return Response.redirect(new URL('/settings/whatsapp?connected=1', req.url));
  } catch (e) {
    return Response.redirect(new URL('/settings/whatsapp?error=exchange_failed', req.url));
  }
}

