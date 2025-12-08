import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../lib/jwt';

export interface AuthRequest extends Request {
  walletAddress?: string;
  user?: {
    userId: string;
    email: string;
  };
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7);
    const payload = verifyToken(token);
    
    req.user = {
      userId: payload.userId,
      email: payload.email
    };
    
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

/**
 * Middleware to extract wallet address from request headers
 * For Web3-only authentication
 */
export const authenticateWallet = (req: AuthRequest, res: Response, next: NextFunction) => {
  const walletAddress = req.headers['x-wallet-address'] as string;

  if (!walletAddress) {
    return res.status(401).json({ error: 'Wallet address required' });
  }

  // Basic validation - Ethereum address format
  if (!/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
    return res.status(400).json({ error: 'Invalid wallet address format' });
  }

  req.walletAddress = walletAddress;
  next();
};

/**
 * Optional authentication - extracts wallet if present but doesn't require it
 */
export const optionalAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const walletAddress = req.headers['x-wallet-address'] as string;

  if (walletAddress && /^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
    req.walletAddress = walletAddress;
  }

  next();
};
