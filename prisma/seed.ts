import prisma from '../lib/prisma'

async function main() {
  const response = await Promise.all([
    prisma.user.upsert({  // Changed from users to user
      where: { email: 'rauchg@vercel.com' },
      update: {},
      create: {
        name: 'Guillermo Rauch',
        email: 'rauchg@vercel.com',
        image: 'https://images.ctfassets.net/e5382hct74si/2P1iOve0LZJRZWUzfXpi9r/9d4d27765764fb1ad7379d7cbe5f1043/ucxb4lHy_400x400.jpg',
        department: 'Engineering',  // Added missing required field
        employeeId: 'emp-001',     // Added missing required field
        position: 'CEO'            // Added missing required field
      },
    }),
    prisma.user.upsert({  // Changed from users to user
      where: { email: 'lee@vercel.com' },
      update: {},
      create: {
        name: 'Lee Robinson',
        email: 'lee@vercel.com',
        image: 'https://images.ctfassets.net/e5382hct74si/4BtM41PDNrx4z1ml643tdc/7aa88bdde8b5b7809174ea5b764c80fa/adWRdqQ6_400x400.jpg',
        department: 'Marketing',    // Added missing required field
        employeeId: 'emp-002',     // Added missing required field
        position: 'CMO'            // Added missing required field
      },
    }),
    prisma.user.upsert({  // Changed from users to user
      where: { email: 'stey@vercel.com' },
      update: {},
      create: {
        name: 'Steven Tey',
        email: 'stey@vercel.com',
        image: 'https://images.ctfassets.net/e5382hct74si/4QEuVLNyZUg5X6X4cW4pVH/eb7cd219e21b29ae976277871cd5ca4b/profile.jpg',
        department: 'Design',       // Added missing required field
        employeeId: 'emp-003',     // Added missing required field
        position: 'Design Lead'    // Added missing required field
      },
    }),
  ])
  console.log(response)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })