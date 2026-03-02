const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { name, email, password: hashedPassword } });
    res.json({ id: user.id, name: user.name, email: user.email });
  } catch (e) { res.status(400).json({ error: "Email already in use" }); }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (user && await bcrypt.compare(password, user.password)) {
    res.json({ id: user.id, name: user.name, email: user.email });
  } else { res.status(401).json({ error: "Invalid credentials" }); }
});

module.exports = router;