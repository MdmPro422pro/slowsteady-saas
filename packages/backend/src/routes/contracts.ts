import express, { Response } from 'express';
import { body, param, validationResult } from 'express-validator';
import prisma from '../lib/prisma';
import { authenticateWallet, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Validation helper
const handleValidationErrors = (req: express.Request, res: express.Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return true;
  }
  return false;
};

// Create a new contract
router.post(
  '/',
  authenticateWallet,
  [
    body('title').trim().isLength({ min: 1, max: 200 }).escape(),
    body('description').optional().trim().isLength({ max: 1000 }).escape(),
    body('content').trim().isLength({ min: 1 }),
    body('templateType').optional().isIn(['nda', 'service', 'sale', 'custom']),
  ],
  async (req: AuthRequest, res: Response) => {
    if (handleValidationErrors(req, res)) return;

    try {
      const {
        title,
        description,
        content,
        templateType,
        partyAName,
        partyAAddress,
        partyBName,
        partyBAddress,
      } = req.body;

      const walletAddress = req.walletAddress!;

      // For Web3-only users, create a user record if it doesn't exist
      let user = await prisma.user.findFirst({
        where: { walletAddress },
      });

      if (!user) {
      user = await prisma.user.create({
        data: {
          walletAddress,
          email: `${walletAddress}@temp.local`, // Temp email for unique constraint
        },
      });
    }

    const contract = await prisma.contract.create({
      data: {
        userId: user.id,
        walletAddress,
        title,
        description,
        content,
        templateType,
        partyAName,
        partyAAddress,
        partyBName,
        partyBAddress,
        status: 'draft',
      },
    });

    res.status(201).json(contract);
  } catch (error: any) {
    console.error('Create contract error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all contracts for a wallet address
router.get(
  '/wallet/:walletAddress',
  authenticateWallet,
  [param('walletAddress').matches(/^0x[a-fA-F0-9]{40}$/)],
  async (req: AuthRequest, res: Response) => {
    if (handleValidationErrors(req, res)) return;

    try {
      const { walletAddress } = req.params;
      const { status } = req.query;

      // Ensure user can only access their own contracts
      if (req.walletAddress !== walletAddress) {
        return res.status(403).json({ error: 'Access denied' });
      }

      const contracts = await prisma.contract.findMany({
        where: {
          walletAddress,
          ...(status && { status: status as string }),
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      res.json(contracts);
    } catch (error: any) {
      console.error('Get contracts error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get a single contract by ID
router.get(
  '/:id',
  authenticateWallet,
  [param('id').isUUID()],
  async (req: AuthRequest, res: Response) => {
    if (handleValidationErrors(req, res)) return;

    try {
      const { id } = req.params;

      const contract = await prisma.contract.findUnique({
        where: { id },
      });

      if (!contract) {
        return res.status(404).json({ error: 'Contract not found' });
      }

      // Ensure user owns the contract
      if (contract.walletAddress !== req.walletAddress) {
        return res.status(403).json({ error: 'Access denied' });
      }

      res.json(contract);
    } catch (error: any) {
      console.error('Get contract error:', error);
      res.status(500).json({ error: error.message });
    }
  }
);

// Update a contract
router.put(
  '/:id',
  authenticateWallet,
  [
    param('id').isUUID(),
    body('title').optional().trim().isLength({ min: 1, max: 200 }).escape(),
    body('description').optional().trim().isLength({ max: 1000 }).escape(),
    body('content').optional().trim().isLength({ min: 1 }),
    body('status').optional().isIn(['draft', 'active', 'signed', 'cancelled']),
  ],
  async (req: AuthRequest, res: Response) => {
    if (handleValidationErrors(req, res)) return;

    try {
      const { id } = req.params;
      const {
        title,
        description,
        content,
        templateType,
        status,
        partyAName,
        partyAAddress,
        partyBName,
        partyBAddress,
        signedByPartyA,
        signedByPartyB,
      } = req.body;

      // Check if contract exists and user owns it
      const existing = await prisma.contract.findUnique({
        where: { id },
      });

      if (!existing) {
        return res.status(404).json({ error: 'Contract not found' });
      }

      // Ensure user owns the contract
      if (existing.walletAddress !== req.walletAddress) {
        return res.status(403).json({ error: 'Access denied' });
      }

      // Prepare update data
    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (content !== undefined) updateData.content = content;
    if (templateType !== undefined) updateData.templateType = templateType;
    if (status !== undefined) updateData.status = status;
    if (partyAName !== undefined) updateData.partyAName = partyAName;
    if (partyAAddress !== undefined) updateData.partyAAddress = partyAAddress;
    if (partyBName !== undefined) updateData.partyBName = partyBName;
    if (partyBAddress !== undefined) updateData.partyBAddress = partyBAddress;
    if (signedByPartyA !== undefined) updateData.signedByPartyA = signedByPartyA;
    if (signedByPartyB !== undefined) updateData.signedByPartyB = signedByPartyB;

    // If both parties signed, update signedAt
    if (signedByPartyA && signedByPartyB && !existing.signedAt) {
      updateData.signedAt = new Date();
      updateData.status = 'signed';
    }

    const contract = await prisma.contract.update({
      where: { id },
      data: updateData,
    });

    res.json(contract);
  } catch (error: any) {
    console.error('Update contract error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete a contract
router.delete(
  '/:id',
  authenticateWallet,
  [param('id').isUUID()],
  async (req: AuthRequest, res: Response) => {
    if (handleValidationErrors(req, res)) return;

    try {
      const { id } = req.params;

      const contract = await prisma.contract.findUnique({
        where: { id },
      });

      if (!contract) {
        return res.status(404).json({ error: 'Contract not found' });
      }

      // Ensure user owns the contract
      if (contract.walletAddress !== req.walletAddress) {
        return res.status(403).json({ error: 'Access denied' });
      }

      await prisma.contract.delete({
        where: { id },
      });

      res.json({ success: true, message: 'Contract deleted' });
    } catch (error: any) {
      console.error('Delete contract error:', error);
      res.status(500).json({ error: error.message });
  }
});

export default router;
