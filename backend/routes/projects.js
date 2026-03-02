const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.post('/create', async (req, res) => {
  const { projectName, userId } = req.body;
  const uniqueCode = crypto.randomUUID().slice(0, 8).toUpperCase(); 
  
  try {
    const project = await prisma.project.create({
      data: { name: projectName, inviteCode: uniqueCode, members: { connect: { id: userId } } }
    });
    res.json(project);
  } catch (e) { res.status(500).json({ error: "Could not create team" }); }
});

router.post('/join', async (req, res) => {
  const { inviteCode, userId } = req.body;
  try {
    const project = await prisma.project.update({
      where: { inviteCode: inviteCode.toUpperCase() },
      data: { members: { connect: { id: userId } } }
    });
    res.json(project);
  } catch (e) { res.status(404).json({ error: "Invalid Invite Code" }); }
});

module.exports = router;