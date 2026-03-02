const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");
  
  // 1. Create a default user
  const user = await prisma.user.create({
    data: { 
      name: 'Hackathon Admin', 
      email: 'admin@hackathon.com',
      isAdmin: true 
    }
  });
  console.log('User created with ID:', user.id);

  // 2. Create the first post linked to that user
  const post = await prisma.post.create({
    data: { 
      title: 'Overcoming the Prisma Bug', 
      content: 'We bypassed the Prisma Studio crash and successfully injected data directly using Node.js! Time to build the frontend.', 
      authorId: user.id 
    }
  });
  console.log(' Post created with ID:', post.id);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());