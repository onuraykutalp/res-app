import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt'

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Helper: BigInt içeren objeleri JSON'a çevirirken BigInt'leri string yap
function safeJsonStringify(data: any) {
  return JSON.stringify(data, (_, value) =>
    typeof value === 'bigint' ? value.toString() : value
  );
}

// JSON cevap göndermek için BigInt'leri stringe çevirip gönderen fonksiyon
function sendJsonSafe(res: express.Response, data: any) {
  const json = safeJsonStringify(data);
  res.setHeader('Content-Type', 'application/json');
  res.send(json);
}


// GET /api/reservations
app.get('/api/reservations', async (req, res) => {
  try {
    const reservations = await prisma.reservation.findMany({
      include: {
        fromWho: true,
        resTaker: true,
      },
    });
    sendJsonSafe(res, reservations);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('GET /api/reservations error:', error);
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Unknown error occurred' });
    }
  }
});

// POST /api/reservations
app.post('/api/reservations', async (req, res) => {
  try {
    const {
      name,
      date,
      fromWho,
      resTable,
      price,
      companyPrice,
      agency,
      m1,
      m2,
      m3,
      v1,
      v2,
      total,
      room,
      description,
      payment,
      resTaker,
    } = req.body;

    const newReservation = await prisma.reservation.create({
      data: {
        name,
        date: new Date(date),
        resTable,
        price,
        companyPrice,
        agency,
        m1,
        m2,
        m3,
        v1,
        v2,
        total,
        room,
        description,
        payment,
        fromWho: { connect: { id: fromWho } },
        resTaker: { connect: { id: resTaker } },
      },
    });

    sendJsonSafe(res.status(201), newReservation);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('POST /api/reservations error:', error.message);
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Unknown error occurred' });
    }
  }
});

// PUT /api/reservations/:id
app.put('/api/reservations/:id', async (req, res) => {
  const { id } = req.params;
  const {
    name,
    date,
    fromWho,
    resTable,
    price,
    companyPrice,
    agency,
    m1,
    m2,
    m3,
    v1,
    v2,
    total,
    room,
    description,
    payment,
    resTaker,
  } = req.body;

  try {
    const updatedReservation = await prisma.reservation.update({
      where: { id },
      data: {
        name,
        date,
        fromWho: { connect: { id: fromWho } },
        resTable,
        price,
        companyPrice,
        agency,
        m1,
        m2,
        m3,
        v1,
        v2,
        total,
        room,
        description,
        payment,
        resTaker: { connect: { id: resTaker } },
      },
    });

    sendJsonSafe(res, updatedReservation);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('PUT /api/reservations/:id error:', error.message);
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Unknown error occurred' });
    }
  }
});

// DELETE /api/reservations/:id
app.delete('/api/reservations/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.reservation.delete({
      where: { id },
    });

    res.json({ message: 'Deleted successfully' });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('DELETE /api/reservations/:id error:', error.message);
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Unknown error occurred' });
    }
  }
});

// GET /api/employee-groups
app.get('/api/employee-groups', async (req, res) => {
  try {
    const groups = await prisma.employeeGroup.findMany();
    sendJsonSafe(res, groups);
  } catch (error) {
    console.error('GET /api/employee-groups error:', error);
    res.status(500).json({ error: 'Failed to fetch employee groups' });
  }
});

app.post('/api/employee-groups', async (req, res) => {
  try {
    const { groupName } = req.body;
    const newGroup = await prisma.employeeGroup.create({
      data: { groupName },
    });
    sendJsonSafe(res.status(201), newGroup);
  } catch (error) {
    console.error('POST /api/employee-groups error:', error);
    res.status(500).json({ error: 'Failed to create employee group' });
  }
});

// GET /api/employees
app.get('/api/employees', async (req, res) => {
  console.log('GET /api/employees called');
  try {
    const employees = await prisma.employee.findMany({ include: { group: true } });
    // phone BigInt olduğu için stringe çevriliyor
    const employeesSafe = employees.map(emp => ({
      ...emp,
      phone: emp.phone.toString(),
    }));
    sendJsonSafe(res, employeesSafe);
  } catch (error) {
    console.error('GET /api/employees error:', error);
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
});

// POST /api/employees
app.post('/api/employees', async (req, res) => {
  try {
    const { name, lastname, phone, username, groupId, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10); // 10 salt rounds

    const newEmployee = await prisma.employee.create({
      data: {
        name,
        lastname,
        phone: BigInt(phone),
        username,
        password: hashedPassword,
        group: { connect: { id: groupId } }
      }
    });

    const safeEmployee = {
      ...newEmployee,
      phone: newEmployee.phone.toString(),
      password: undefined // Şifreyi response'ta gizle
    };

    sendJsonSafe(res.status(201), safeEmployee);
  } catch (error) {
    console.error('POST /api/employees error:', error);
    res.status(500).json({ error: 'Failed to create employee' });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await prisma.employee.findUnique({
      where: { username },
    });

    if (!user || !user.password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Giriş başarılı
    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        lastname: user.lastname,
        groupId: user.groupId,
      },
    });
  } catch (error) {
    console.error('POST /api/login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/employees/:id
app.put('/api/employees/:id', async (req, res) => {
  const { id } = req.params;
  const { name, lastname, phone, username, groupId } = req.body;
  try {
    const updated = await prisma.employee.update({
      where: { id },
      data: {
        name,
        lastname,
        phone: BigInt(phone),
        username,
        group: { connect: { id: groupId } },
      }
    });
    const updatedSafe = { ...updated, phone: updated.phone.toString() };
    sendJsonSafe(res, updatedSafe);
  } catch (error){
    console.error('PUT /api/employees/:id error', error);
    res.status(500).json({error: 'Failed to update employee'});
  }
});

// DELETE /api/employees/:id
app.delete('/api/employees/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.employee.delete({ where: { id } });
    res.json({ message: 'Deleted Successfully' });
  } catch (error) {
    console.error('DELETE /api/employees/:id error:', error);
    res.status(500).json({error: 'Failed to delete employee'});
  }
});

app.get('/api/clients', async (req, res) => {
  try {
    const clients = await  prisma.client.findMany({
      include: {
        whoCreated: true,
        whoUpdated: true,
      },
    });
    sendJsonSafe(res, clients);
  } catch (error) {
    console.error('GET /api/clients error:', error);
    res.status(500).json({error: 'Failed to get clients'});
  }
});

app.post('/api/clients', async (req, res) => {
  try{
    const { company, clientType, currency, tax, limit, whoCreatedId } = req.body;
    const employee = await prisma.employee.findUnique({ where: { id: whoCreatedId } });
    console.log('Employee found:', employee);

    if (!employee) {
      return res.status(400).json({ error: 'Employee not found for whoCreatedId' });
    }
    
    const newClient = await prisma.client.create({
      data: {
        company,
        clientType,
        currency,
        tax,
        limit,
        whoCreated: { connect: { id: whoCreatedId } }
      },
      include: { whoCreated: true }
    });
     sendJsonSafe(res.status(201), newClient);
  } catch (error){
    console.error('POST /api/clients error:', error);
    res.status(500).json({ error: 'Failed to create client' });
  }
});

app.put('/api/clients/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Burada whoUpdatedId'yi de destructure et
    const { company, clientType, currency, tax, limit, whoUpdatedId } = req.body;

    if (!whoUpdatedId) {
      return res.status(400).json({ error: 'whoUpdatedId is required' });
    }

    const updatedClient = await prisma.client.update({
      where: { id },
      data: {
        company,
        clientType,
        currency,
        tax,
        limit,
        lastUpdate: new Date(),
        whoUpdated: { connect: { id: whoUpdatedId } },
      },
      include: { whoCreated: true, whoUpdated: true },
    });

    sendJsonSafe(res, updatedClient);
  } catch (error) {
    console.error('PUT /api/clients/:id error:', error);
    res.status(500).json({ error: 'Failed to update client' });
  }
});

app.delete('/api/clients/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.client.delete({ where: { id } });
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    console.error('DELETE /api/clients/:id error:', error);
    res.status(500).json({ error: 'Failed to delete client' });
  }
})

// Sağlık testi
app.get('/test', (req, res) => {
  res.send('Server is working!');
});

app.listen(3001, () => {
  console.log('✅ Server running on http://localhost:3001');
});
