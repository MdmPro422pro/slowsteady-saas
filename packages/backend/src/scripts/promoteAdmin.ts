import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Script to promote a user to admin by wallet address or email
 * Usage: ts-node src/scripts/promoteAdmin.ts <wallet-address-or-email>
 */
async function promoteAdmin() {
  const identifier = process.argv[2];

  if (!identifier) {
    console.error('❌ Please provide a wallet address or email');
    console.log('Usage: ts-node src/scripts/promoteAdmin.ts <wallet-address-or-email>');
    process.exit(1);
  }

  try {
    // Try to find user by wallet address or email
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { walletAddress: identifier.toLowerCase() },
          { email: identifier.toLowerCase() }
        ]
      }
    });

    if (!user) {
      console.error(`❌ User not found: ${identifier}`);
      process.exit(1);
    }

    if (user.isAdmin) {
      console.log(`⚠️  User ${user.email || user.walletAddress} is already an admin`);
      process.exit(0);
    }

    // Promote to admin
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { isAdmin: true }
    });

    console.log('✅ User promoted to admin successfully!');
    console.log('   Email:', updatedUser.email || 'N/A');
    console.log('   Wallet:', updatedUser.walletAddress || 'N/A');
    console.log('   Admin:', updatedUser.isAdmin);

  } catch (error) {
    console.error('❌ Error promoting user:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

promoteAdmin();
