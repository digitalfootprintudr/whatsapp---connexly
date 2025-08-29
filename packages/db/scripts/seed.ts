import { prisma } from '../src';
import bcrypt from 'bcryptjs';

async function main(): Promise<void> {
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

  const vendorAdminHash = await bcrypt.hash('vendor123', 10);
  await prisma.user.upsert({
    where: { email: 'vendor@example.com' },
    update: { passwordHash: vendorAdminHash, role: 'VENDOR_ADMIN' },
    create: {
      email: 'vendor@example.com',
      name: 'Vendor Admin',
      passwordHash: vendorAdminHash,
      role: 'VENDOR_ADMIN',
      vendorId: vendor.id,
      isActive: true,
    },
  });

  const agentHash = await bcrypt.hash('agent123', 10);
  await prisma.user.upsert({
    where: { email: 'agent@example.com' },
    update: { passwordHash: agentHash, role: 'AGENT' },
    create: {
      email: 'agent@example.com',
      name: 'Support Agent',
      passwordHash: agentHash,
      role: 'AGENT',
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

  // Minimal sample contact
  await prisma.contact.upsert({
    where: { id: 'seed-contact-1' },
    update: {},
    create: {
      id: 'seed-contact-1',
      vendorId: vendor.id,
      phone: '+10000000000',
      name: 'Test Contact',
    },
  });

  console.log('Seed complete:');
  console.log('- admin@example.com / admin123 (SUPER_ADMIN)');
  console.log('- vendor@example.com / vendor123 (VENDOR_ADMIN)');
  console.log('- agent@example.com / agent123 (AGENT)');
}

main()
  .catch(err => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

