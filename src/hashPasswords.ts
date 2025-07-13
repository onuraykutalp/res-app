import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function hashPasswords() {
    const employees = await prisma.employee.findMany({
        where: {
            password: {
                not: undefined
            }
        }
    });

    for (const emp of employees) {
        if (emp.password && emp.password.length < 60) {
            const hashed = await bcrypt.hash(emp.password, 10);
            await prisma.employee.update({
                where: { id: emp.id },
                data: { password: hashed },
            });
            console.log(`Hashed password for ${emp.username}`);
        }
    }

    await prisma.$disconnect();
}

hashPasswords().catch(e => {
    console.error(e);
    prisma.$disconnect();
});
