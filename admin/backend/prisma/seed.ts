import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Katalyst Database Seed...');

  const adminEmail = 'admin@katalyst.org';
  const plainPassword = 'KatalystAdmin@2025';
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(plainPassword, salt);

  const admin = await prisma.admin.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash,
      name: 'Katalyst Executive Admin',
      role: Role.SUPER_ADMIN,
    },
    create: {
      email: adminEmail,
      name: 'Katalyst Executive Admin',
      passwordHash,
      role: Role.SUPER_ADMIN,
    },
  });

  console.log(`✅ Admin user seeded successfully!`);
  console.log(`   Email:    ${admin.email}`);
  console.log(`   Role:     ${admin.role}`);
  console.log(`   Password: ${plainPassword}`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
