import { prisma } from '@whatsjet/db/src';
import { getSessionVendor } from '@/lib/rbac';

export async function POST(req: Request) {
  const { vendorId } = await getSessionVendor();
  const body = await req.json();
  const updated = await prisma.vendor.update({
    where: { id: vendorId },
    data: {
      logoUrlLight: body.logoUrlLight ?? null,
      logoUrlDark: body.logoUrlDark ?? null,
      faviconUrlLight: body.faviconUrlLight ?? null,
      faviconUrlDark: body.faviconUrlDark ?? null,
    },
    select: { id: true },
  });
  return Response.json({ ok: true, id: updated.id });
}

