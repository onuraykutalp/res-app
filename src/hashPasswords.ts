import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function hashPasswords() {
  const employees = await prisma.employee.findMany();

  for (const emp of employees) {
    // Şifresi yoksa default şifre ata
    if (!emp.password) {
      const hashedDefault = await bcrypt.hash("default1234", 10);
      await prisma.employee.update({
        where: { id: emp.id },
        data: { password: hashedDefault },
      });
      console.log(`✅ Default password set for ${emp.username}`);
    }
    // Şifresi varsa ama hash değilse (muhtemelen düz metin)
    else if (emp.password.length < 60) {
      const hashed = await bcrypt.hash(emp.password, 10);
      await prisma.employee.update({
        where: { id: emp.id },
        data: { password: hashed },
      });
      console.log(`🔒 Hashed existing password for ${emp.username}`);
    } else {
      console.log(`⏭ Already hashed: ${emp.username}`);
    }
  }

  await prisma.$disconnect();
}

hashPasswords().catch((e) => {
  console.error(e);
  prisma.$disconnect();
});
