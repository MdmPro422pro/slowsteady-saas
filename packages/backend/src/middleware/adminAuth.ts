import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Middleware to verify admin role
 * Requires authenticateWallet middleware to run first
 */
export async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const walletAddress = req.headers['x-wallet-address'] as string;

    if (!walletAddress) {
      return res.status(401).json({ error: 'Wallet address not provided' });
    }

    // Check if user exists and is admin
    const user = await prisma.user.findUnique({
      where: { walletAddress: walletAddress.toLowerCase() },
      select: { isAdmin: true, walletAddress: true }
    });

    if (!user) {
      return res.status(403).json({ error: 'User not found' });
    }

    if (!user.isAdmin) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    next();
  } catch (error) {
    console.error('Admin auth error:', error);
    res.status(500).json({ error: 'Admin authentication failed' });
  }
}
