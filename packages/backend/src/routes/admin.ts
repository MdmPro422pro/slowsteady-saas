import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateWallet } from '../middleware/auth';
import { requireAdmin } from '../middleware/adminAuth';

const router = express.Router();
const prisma = new PrismaClient();

// Apply authentication to all admin routes
router.use(authenticateWallet);
router.use(requireAdmin);

// ============================================
// ANALYTICS
// ============================================

/**
 * GET /api/admin/analytics
 * Get platform analytics overview
 */
router.get('/analytics', async (req, res) => {
  try {
    const [
      totalUsers,
      totalContracts,
      totalMessages,
      totalMemberships,
      activeUsers,
      contractsByStatus,
      membershipsByTier,
      recentActivity
    ] = await Promise.all([
      // Total users
      prisma.user.count(),
      
      // Total contracts
      prisma.contract.count(),
      
      // Total messages
      prisma.message.count(),
      
      // Total memberships
      prisma.membership.count(),
      
      // Active users (logged in last 30 days)
      prisma.user.count({
        where: {
          updatedAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          }
        }
      }),
      
      // Contracts by status
      prisma.contract.groupBy({
        by: ['status'],
        _count: true
      }),
      
      // Memberships by tier
      prisma.membership.groupBy({
        by: ['tier'],
        _count: true
      }),
      
      // Recent activity (last 10 contracts and messages)
      Promise.all([
        prisma.contract.findMany({
          take: 10,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            title: true,
            status: true,
            createdAt: true,
            walletAddress: true
          }
        }),
        prisma.message.findMany({
          take: 10,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            content: true,
            room: true,
            createdAt: true,
            username: true
          }
        })
      ])
    ]);

    res.json({
      success: true,
      analytics: {
        users: {
          total: totalUsers,
          active: activeUsers
        },
        contracts: {
          total: totalContracts,
          byStatus: contractsByStatus.reduce((acc: any, item: any) => {
            acc[item.status] = item._count;
            return acc;
          }, {} as Record<string, number>)
        },
        memberships: {
          total: totalMemberships,
          byTier: membershipsByTier.reduce((acc: any, item: any) => {
            acc[item.tier] = item._count;
            return acc;
          }, {} as Record<string, number>)
        },
        messages: {
          total: totalMessages
        },
        recentActivity: {
          contracts: recentActivity[0],
          messages: recentActivity[1]
        }
      }
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// ============================================
// USER MANAGEMENT
// ============================================

/**
 * GET /api/admin/users
 * Get all users with pagination
 */
router.get('/users', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          name: true,
          walletAddress: true,
          isAdmin: true,
          emailVerified: true,
          twoFactorEnabled: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              contracts: true,
              messages: true,
              memberships: true
            }
          }
        }
      }),
      prisma.user.count()
    ]);

    res.json({
      success: true,
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

/**
 * GET /api/admin/users/:id
 * Get single user details
 */
router.get('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        memberships: {
          orderBy: { createdAt: 'desc' }
        },
        contracts: {
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 20
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

/**
 * PATCH /api/admin/users/:id
 * Update user (promote to admin, ban, etc.)
 */
router.patch('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { isAdmin, emailVerified } = req.body;

    const updates: any = {};
    if (typeof isAdmin === 'boolean') updates.isAdmin = isAdmin;
    if (typeof emailVerified === 'boolean') updates.emailVerified = emailVerified;

    const user = await prisma.user.update({
      where: { id },
      data: updates,
      select: {
        id: true,
        email: true,
        walletAddress: true,
        isAdmin: true,
        emailVerified: true
      }
    });

    res.json({ success: true, user });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

/**
 * DELETE /api/admin/users/:id
 * Delete user and all related data
 */
router.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Delete user and cascade to related records
    await prisma.user.delete({
      where: { id }
    });

    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// ============================================
// CONTRACT MANAGEMENT
// ============================================

/**
 * GET /api/admin/contracts
 * Get all contracts with filters
 */
router.get('/contracts', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const status = req.query.status as string;
    const skip = (page - 1) * limit;

    const where = status ? { status: status as any } : {};

    const [contracts, total] = await Promise.all([
      prisma.contract.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              email: true,
              walletAddress: true
            }
          }
        }
      }),
      prisma.contract.count({ where })
    ]);

    res.json({
      success: true,
      contracts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching contracts:', error);
    res.status(500).json({ error: 'Failed to fetch contracts' });
  }
});

/**
 * PATCH /api/admin/contracts/:id
 * Update contract status (moderate, approve, etc.)
 */
router.patch('/contracts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['draft', 'pending', 'active', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const contract = await prisma.contract.update({
      where: { id },
      data: { status }
    });

    res.json({ success: true, contract });
  } catch (error) {
    console.error('Error updating contract:', error);
    res.status(500).json({ error: 'Failed to update contract' });
  }
});

/**
 * DELETE /api/admin/contracts/:id
 * Delete contract (moderation)
 */
router.delete('/contracts/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.contract.delete({
      where: { id }
    });

    res.json({ success: true, message: 'Contract deleted successfully' });
  } catch (error) {
    console.error('Error deleting contract:', error);
    res.status(500).json({ error: 'Failed to delete contract' });
  }
});

// ============================================
// MESSAGE MODERATION
// ============================================

/**
 * GET /api/admin/messages
 * Get all messages with filters
 */
router.get('/messages', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const room = req.query.room as string;
    const skip = (page - 1) * limit;

    const where = room ? { room } : {};

    const [messages, total] = await Promise.all([
      prisma.message.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.message.count({ where })
    ]);

    res.json({
      success: true,
      messages,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

/**
 * DELETE /api/admin/messages/:id
 * Delete message (moderation)
 */
router.delete('/messages/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.message.delete({
      where: { id }
    });

    res.json({ success: true, message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ error: 'Failed to delete message' });
  }
});

export default router;
