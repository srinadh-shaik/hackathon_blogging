const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const crypto = require('crypto');

// Create a new team
router.post('/create', async (req, res) => {
  const { projectName, userId } = req.body;
  try {
    // Generate a secure 6-character invite code (e.g., "A7F9B2")
    const inviteCode = crypto.randomBytes(3).toString('hex').toUpperCase();
    
    const project = await prisma.project.create({
      data: {
        name: projectName,
        inviteCode: inviteCode,
        users: { connect: { id: parseInt(userId) } }
      }
    });
    res.json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create workspace" });
  }
});

// Join an existing team
router.post('/join', async (req, res) => {
  const { inviteCode, userId } = req.body;
  try {
    const project = await prisma.project.update({
      where: { inviteCode: inviteCode },
      data: {
        users: { connect: { id: parseInt(userId) } }
      }
    });
    res.json(project);
  } catch (error) {
    res.status(400).json({ error: "Invalid Access Token" });
  }
});

module.exports = router;