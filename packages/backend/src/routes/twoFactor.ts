import { Router, Response } from 'express';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import { body, validationResult } from 'express-validator';
import prisma from '../lib/prisma';
import { authenticate, AuthRequest } from '../middleware/auth';
import { generateAccessToken, generateRefreshToken } from '../lib/jwt';

const router = Router();

// Generate 2FA secret and QR code
router.post('/setup', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.twoFactorEnabled) {
      return res.status(400).json({ error: '2FA is already enabled' });
    }

    // Generate secret
    const secret = speakeasy.generateSecret({
      name: `Slowsteady (${user.email})`,
      issuer: 'Slowsteady'
    });

    // Generate QR code
    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url!);

    // Store the secret temporarily (not yet enabled)
    await prisma.user.update({
      where: { id: userId },
      data: { twoFactorSecret: secret.base32 }
    });

    res.json({
      secret: secret.base32,
      qrCode: qrCodeUrl,
      message: 'Scan the QR code with your authenticator app and verify with a code'
    });
  } catch (error) {
    console.error('2FA setup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Verify and enable 2FA
router.post(
  '/verify',
  authenticate,
  [body('code').isLength({ min: 6, max: 6 })],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const userId = req.user!.userId;
      const { code } = req.body;

      const user = await prisma.user.findUnique({ where: { id: userId } });

      if (!user || !user.twoFactorSecret) {
        return res.status(400).json({ error: '2FA not set up' });
      }

      // Verify the token
      const verified = speakeasy.totp.verify({
        secret: user.twoFactorSecret,
        encoding: 'base32',
        token: code,
        window: 2 // Allow 2 time windows for clock drift
      });

      if (!verified) {
        return res.status(400).json({ error: 'Invalid 2FA code' });
      }

      // Enable 2FA
      await prisma.user.update({
        where: { id: userId },
        data: { twoFactorEnabled: true }
      });

      res.json({
        message: '2FA enabled successfully',
        twoFactorEnabled: true
      });
    } catch (error) {
      console.error('2FA verify error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// Verify 2FA code during login
router.post(
  '/login-verify',
  [body('code').isLength({ min: 6, max: 6 })],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { tempToken, code } = req.body;

      if (!tempToken) {
        return res.status(401).json({ error: 'Temporary token required' });
      }

      // Verify temp token
      const { verifyToken } = await import('../lib/jwt');
      const payload = verifyToken(tempToken);

      const user = await prisma.user.findUnique({ where: { id: payload.userId } });

      if (!user || !user.twoFactorEnabled || !user.twoFactorSecret) {
        return res.status(400).json({ error: 'Invalid 2FA setup' });
      }

      // Verify the TOTP code
      const verified = speakeasy.totp.verify({
        secret: user.twoFactorSecret,
        encoding: 'base32',
        token: code,
        window: 2
      });

      if (!verified) {
        return res.status(400).json({ error: 'Invalid 2FA code' });
      }

      // Generate final tokens
      const accessToken = generateAccessToken({ userId: user.id, email: user.email });
      const refreshToken = generateRefreshToken({ userId: user.id, email: user.email });

      res.json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          twoFactorEnabled: user.twoFactorEnabled
        },
        accessToken,
        refreshToken
      });
    } catch (error) {
      console.error('2FA login verify error:', error);
      res.status(401).json({ error: 'Invalid or expired token' });
    }
  }
);

// Disable 2FA
router.post(
  '/disable',
  authenticate,
  [body('password').notEmpty()],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const userId = req.user!.userId;
      const { password } = req.body;

      const user = await prisma.user.findUnique({ where: { id: userId } });

      if (!user || !user.password) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Verify password
      const bcrypt = await import('bcryptjs');
      const validPassword = await bcrypt.compare(password, user.password);

      if (!validPassword) {
        return res.status(401).json({ error: 'Invalid password' });
      }

      // Disable 2FA
      await prisma.user.update({
        where: { id: userId },
        data: {
          twoFactorEnabled: false,
          twoFactorSecret: null
        }
      });

      res.json({
        message: '2FA disabled successfully',
        twoFactorEnabled: false
      });
    } catch (error) {
      console.error('2FA disable error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

export default router;
