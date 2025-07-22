import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const categories = ['Frontend', 'Backend', 'DevOps', 'AI', 'Design']
  for (const name of categories) {
    await prisma.articleCategory.upsert({
      where: { name },
      update: {},
      create: { name },
    })
  }

  const tags = ['React', 'Node.js', 'TypeScript', 'Docker', 'Figma', 'Next.js', 'PostgreSQL']
  for (const name of tags) {
    await prisma.articleTag.upsert({
      where: { name },
      update: {},
      create: { name },
    })
  }

  await prisma.article.create({
    data: {
      title: 'Что нового в React 19',
      subtitle: 'Обзор новых фич',
      content: 'Очень интересный контент...',
      published: true,
      author: {
        connect: { id: 'cmct849u90000u8woztu6gerk' },
      },
      category: {
        connect: { name: 'Frontend' },
      },
      tags: {
        connect: [
          { name: 'React' },
          { name: 'TypeScript' },
          { name: 'Next.js' },
        ],
      },
    },
    include: {
      tags: true,
      category: true,
    },
  })
}

main()
  .then(() => console.log('✅ Seed completed'))
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
