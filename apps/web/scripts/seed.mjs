import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
async function main() {
  const vendor = await prisma.vendor.upsert({
    where: { id: 'seed-vendor-1' },
    update: {},
    create: {
      id: 'seed-vendor-1',
      name: 'Default Vendor',
      status: 'ACTIVE',
    },
  });

  const plan = await prisma.subscriptionPlan.upsert({
    where: { name: 'Free' },
    update: {},
    create: {
      name: 'Free',
      contactsLimit: 2,
      campaignsPerMonth: 10,
      botRepliesLimit: 10,
      botFlowsLimit: 5,
      customFieldsLimit: 2,
      teamMembersLimit: 0,
      aiChatBotEnabled: false,
      apiAccessEnabled: false,
    },
  });

  const passwordHash = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: { passwordHash },
    create: {
      email: 'admin@example.com',
      name: 'Super Admin',
      passwordHash,
      role: 'SUPER_ADMIN',
      vendorId: vendor.id,
      isActive: true,
    },
  });

  await prisma.subscription.upsert({
    where: { id: 'seed-sub-1' },
    update: {},
    create: {
      id: 'seed-sub-1',
      vendorId: vendor.id,
      planId: plan.id,
      status: 'ACTIVE',
    },
  });

  console.log('Seed complete: admin@example.com / admin123');
}

main().finally(async () => prisma.$disconnect());

