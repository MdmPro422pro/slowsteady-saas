import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import rateLimit from 'express-rate-limit';
import { authenticate } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// SECURITY: Rate limiting for settings endpoints - prevent abuse
const settingsLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit each user to 50 requests per 15 minutes
  message: 'Too many settings updates, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

router.use(settingsLimiter);

// Apply authentication to ALL settings routes
router.use(authenticate);

// Get user settings
router.get('/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    
    // SECURITY: Verify user can only access their own settings
    if (req.user?.userId !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        email: true,
        phone: true,
        address: true,
        city: true,
        state: true,
        zipCode: true,
        country: true,
        language: true,
        timezone: true,
        dateFormat: true,
        theme: true,
        emailNotifications: true,
        smsNotifications: true,
        pushNotifications: true,
        weeklyDigest: true,
        marketingEmails: true,
        profileVisibility: true,
        showEmail: true,
        showActivity: true,
        walletAddress: true,
        googleId: true,
        githubId: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user settings:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// Update account settings
router.patch('/:userId/account', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    
    // SECURITY: Verify user can only update their own settings
    if (req.user?.userId !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    const { name, email, phone, address, city, state, zipCode, country } = req.body;
    
    // SECURITY: Validate and sanitize input
    const sanitizedData: any = {};
    
    if (name !== undefined) {
      if (typeof name !== 'string' || name.length > 100) {
        return res.status(400).json({ error: 'Invalid name' });
      }
      sanitizedData.name = name.trim();
    }
    
    if (email !== undefined) {
      if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
      }
      sanitizedData.email = email.toLowerCase().trim();
    }
    
    if (phone !== undefined) {
      if (typeof phone !== 'string' || phone.length > 20) {
        return res.status(400).json({ error: 'Invalid phone number' });
      }
      sanitizedData.phone = phone.trim();
    }
    
    if (address !== undefined) {
      if (typeof address !== 'string' || address.length > 200) {
        return res.status(400).json({ error: 'Invalid address' });
      }
      sanitizedData.address = address.trim();
    }
    
    if (city !== undefined) {
      if (typeof city !== 'string' || city.length > 100) {
        return res.status(400).json({ error: 'Invalid city' });
      }
      sanitizedData.city = city.trim();
    }
    
    if (state !== undefined) {
      if (typeof state !== 'string' || state.length > 100) {
        return res.status(400).json({ error: 'Invalid state' });
      }
      sanitizedData.state = state.trim();
    }
    
    if (zipCode !== undefined) {
      if (typeof zipCode !== 'string' || zipCode.length > 20) {
        return res.status(400).json({ error: 'Invalid zip code' });
      }
      sanitizedData.zipCode = zipCode.trim();
    }
    
    if (country !== undefined) {
      if (typeof country !== 'string' || country.length > 100) {
        return res.status(400).json({ error: 'Invalid country' });
      }
      sanitizedData.country = country.trim();
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: sanitizedData,
    });

    res.json({ message: 'Account settings updated', user: updatedUser });
  } catch (error) {
    console.error('Error updating account settings:', error);
    res.status(500).json({ error: 'Failed to update account settings' });
  }
});

// Update notification settings
router.patch('/:userId/notifications', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    
    // SECURITY: Verify user can only update their own settings
    if (req.user?.userId !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    const {
      emailNotifications,
      smsNotifications,
      pushNotifications,
      weeklyDigest,
      marketingEmails,
    } = req.body;
    
    // SECURITY: Validate boolean values
    const sanitizedData: any = {};
    
    if (emailNotifications !== undefined) {
      if (typeof emailNotifications !== 'boolean') {
        return res.status(400).json({ error: 'Invalid notification setting' });
      }
      sanitizedData.emailNotifications = emailNotifications;
    }
    
    if (smsNotifications !== undefined) {
      if (typeof smsNotifications !== 'boolean') {
        return res.status(400).json({ error: 'Invalid notification setting' });
      }
      sanitizedData.smsNotifications = smsNotifications;
    }
    
    if (pushNotifications !== undefined) {
      if (typeof pushNotifications !== 'boolean') {
        return res.status(400).json({ error: 'Invalid notification setting' });
      }
      sanitizedData.pushNotifications = pushNotifications;
    }
    
    if (weeklyDigest !== undefined) {
      if (typeof weeklyDigest !== 'boolean') {
        return res.status(400).json({ error: 'Invalid notification setting' });
      }
      sanitizedData.weeklyDigest = weeklyDigest;
    }
    
    if (marketingEmails !== undefined) {
      if (typeof marketingEmails !== 'boolean') {
        return res.status(400).json({ error: 'Invalid notification setting' });
      }
      sanitizedData.marketingEmails = marketingEmails;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: sanitizedData,
    });

    res.json({ message: 'Notification settings updated', user: updatedUser });
  } catch (error) {
    console.error('Error updating notification settings:', error);
    res.status(500).json({ error: 'Failed to update notification settings' });
  }
});

// Update privacy settings
router.patch('/:userId/privacy', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    
    // SECURITY: Verify user can only update their own settings
    if (req.user?.userId !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    const { profileVisibility, showEmail, showActivity } = req.body;
    
    // SECURITY: Validate privacy settings
    const sanitizedData: any = {};
    
    if (profileVisibility !== undefined) {
      const validVisibility = ['public', 'private', 'friends'];
      if (!validVisibility.includes(profileVisibility)) {
        return res.status(400).json({ error: 'Invalid profile visibility' });
      }
      sanitizedData.profileVisibility = profileVisibility;
    }
    
    if (showEmail !== undefined) {
      if (typeof showEmail !== 'boolean') {
        return res.status(400).json({ error: 'Invalid privacy setting' });
      }
      sanitizedData.showEmail = showEmail;
    }
    
    if (showActivity !== undefined) {
      if (typeof showActivity !== 'boolean') {
        return res.status(400).json({ error: 'Invalid privacy setting' });
      }
      sanitizedData.showActivity = showActivity;
    }

    const updatedUser = await prisma.user.update({
    const { language, timezone, dateFormat, theme } = req.body;
    
    // SECURITY: Validate display settings with whitelists
    const sanitizedData: any = {};
    
    if (language !== undefined) {
      const validLanguages = ['en', 'es', 'fr', 'de', 'zh', 'ja'];
      if (!validLanguages.includes(language)) {
        return res.status(400).json({ error: 'Invalid language' });
      }
      sanitizedData.language = language;
    }
    
    if (timezone !== undefined) {
      const validTimezones = [
        'America/New_York', 'America/Los_Angeles', 'America/Chicago',
        'Europe/London', 'Europe/Paris', 'Asia/Tokyo', 'Asia/Shanghai', 'Australia/Sydney'
      ];
      if (!validTimezones.includes(timezone)) {
        return res.status(400).json({ error: 'Invalid timezone' });
      }
      sanitizedData.timezone = timezone;
    }
    
    if (dateFormat !== undefined) {
      const validFormats = ['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD'];
      if (!validFormats.includes(dateFormat)) {
        return res.status(400).json({ error: 'Invalid date format' });
      }
      sanitizedData.dateFormat = dateFormat;
    }
    
    if (theme !== undefined) {
      const validThemes = ['light', 'dark'];
      if (!validThemes.includes(theme)) {
        return res.status(400).json({ error: 'Invalid theme' });
      }
      sanitizedData.theme = theme;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: sanitizedData,
    });
// Update display settings
router.patch('/:userId/display', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    
    // SECURITY: Verify user can only update their own settings
    if (req.user?.userId !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    const { language, timezone, dateFormat, theme } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(language !== undefined && { language }),
        ...(timezone !== undefined && { timezone }),
        ...(dateFormat !== undefined && { dateFormat }),
        ...(theme !== undefined && { theme }),
      },
    });

    res.json({ message: 'Display settings updated', user: updatedUser });
  } catch (error) {
    console.error('Error updating display settings:', error);
    res.status(500).json({ error: 'Failed to update display settings' });
  }
});

export default router;
