import { prisma } from '@whatsjet/db/src';
import { getSessionVendor } from '../../../../lib/rbac';

export async function GET() {
  try {
    const { vendorId } = await getSessionVendor();
    const vendor = await prisma.vendor.findUnique({
      where: { id: vendorId },
      select: {
        id: true,
        name: true,
        logoUrlLight: true,
        logoUrlDark: true,
        faviconUrlLight: true,
        faviconUrlDark: true,
      },
    });
    return Response.json({ vendor });
  } catch (e) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

