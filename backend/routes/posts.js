const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.get('/global', async (req, res) => {
  const posts = await prisma.post.findMany({
    where: { isPublic: true },
    include: { author: { select: { name: true } }, project: { select: { name: true } } },
    orderBy: { createdAt: 'desc' }
  });
  res.json(posts);
});

router.get('/history/:userId', async (req, res) => {
  const posts = await prisma.post.findMany({
    where: { authorId: parseInt(req.params.userId) },
    include: { project: { select: { name: true } } },
    orderBy: { createdAt: 'desc' }
  });
  res.json(posts);
});

router.get('/team/:projectId', async (req, res) => {
  const posts = await prisma.post.findMany({
    where: { projectId: parseInt(req.params.projectId) },
    include: { author: { select: { name: true } }, project: { select: { name: true } } },
    orderBy: { createdAt: 'desc' }
  });
  res.json(posts);
});

router.post('/', async (req, res) => {
  const { title, content, imageUrl, researchLink, isPublic, postType, authorId, projectId } = req.body;
  
  try {
    // We use 'include' here so the returned post has the author and project names attached
    const post = await prisma.post.create({
      data: { title, content, imageUrl, researchLink, isPublic, postType, authorId: parseInt(authorId), projectId: parseInt(projectId) },
      include: { author: { select: { name: true } }, project: { select: { name: true } } }
    });

    // Broadcast the new post to all connected clients
    const io = req.app.get('io');
    io.emit('new_post', post);

    res.json(post);
  } catch (error) {
    res.status(500).json({ error: "Failed to create post" });
  }
});

module.exports = router;