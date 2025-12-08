import express from 'express';
import prisma from '../lib/prisma';

const router = express.Router();

// Create a new contract
router.post('/', async (req, res) => {
  try {
    const {
      walletAddress,
      title,
      description,
      content,
      templateType,
      partyAName,
      partyAAddress,
      partyBName,
      partyBAddress,
    } = req.body;

    if (!walletAddress || !title || !content) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

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
router.get('/wallet/:walletAddress', async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const { status } = req.query;

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
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const contract = await prisma.contract.findUnique({
      where: { id },
    });

    if (!contract) {
      return res.status(404).json({ error: 'Contract not found' });
    }

    res.json(contract);
  } catch (error: any) {
    console.error('Get contract error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update a contract
router.put('/:id', async (req, res) => {
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

    // Check if contract exists
    const existing = await prisma.contract.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Contract not found' });
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
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const contract = await prisma.contract.findUnique({
      where: { id },
    });

    if (!contract) {
      return res.status(404).json({ error: 'Contract not found' });
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
