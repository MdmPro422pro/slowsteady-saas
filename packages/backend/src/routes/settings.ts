import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get user settings
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
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
router.patch('/:userId/account', async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, email, phone, address, city, state, zipCode, country } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name !== undefined && { name }),
        ...(email !== undefined && { email }),
        ...(phone !== undefined && { phone }),
        ...(address !== undefined && { address }),
        ...(city !== undefined && { city }),
        ...(state !== undefined && { state }),
        ...(zipCode !== undefined && { zipCode }),
        ...(country !== undefined && { country }),
      },
    });

    res.json({ message: 'Account settings updated', user: updatedUser });
  } catch (error) {
    console.error('Error updating account settings:', error);
    res.status(500).json({ error: 'Failed to update account settings' });
  }
});

// Update notification settings
router.patch('/:userId/notifications', async (req, res) => {
  try {
    const { userId } = req.params;
    const {
      emailNotifications,
      smsNotifications,
      pushNotifications,
      weeklyDigest,
      marketingEmails,
    } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(emailNotifications !== undefined && { emailNotifications }),
        ...(smsNotifications !== undefined && { smsNotifications }),
        ...(pushNotifications !== undefined && { pushNotifications }),
        ...(weeklyDigest !== undefined && { weeklyDigest }),
        ...(marketingEmails !== undefined && { marketingEmails }),
      },
    });

    res.json({ message: 'Notification settings updated', user: updatedUser });
  } catch (error) {
    console.error('Error updating notification settings:', error);
    res.status(500).json({ error: 'Failed to update notification settings' });
  }
});

// Update privacy settings
router.patch('/:userId/privacy', async (req, res) => {
  try {
    const { userId } = req.params;
    const { profileVisibility, showEmail, showActivity } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(profileVisibility !== undefined && { profileVisibility }),
        ...(showEmail !== undefined && { showEmail }),
        ...(showActivity !== undefined && { showActivity }),
      },
    });

    res.json({ message: 'Privacy settings updated', user: updatedUser });
  } catch (error) {
    console.error('Error updating privacy settings:', error);
    res.status(500).json({ error: 'Failed to update privacy settings' });
  }
});

// Update display settings
router.patch('/:userId/display', async (req, res) => {
  try {
    const { userId } = req.params;
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
