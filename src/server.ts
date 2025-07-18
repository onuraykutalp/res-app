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


// CREATE - Yeni rezervasyon ekle
app.post("/api/reservations", async (req, res) => {
  try {
    const data = req.body;

    const created = await prisma.reservation.create({
      data: {
        date: data.date ? new Date(data.date) : new Date(), // varsayılan tarih
        paymentType: data.paymentType,
        room: data.room,
        voucherNo: data.voucherNo,
        nationality: data.nationality,
        description: data.description,
        transferNote: data.transferNote,
        ship: data.ship,

        // ID kontrolleri
        fromWhoId: data.fromWhoId || null,
        resTakerId: data.resTakerId || null,
        authorizedId: data.authorizedId || null,
        arrivalTransferId: data.arrivalTransferId || null,
        returnTransferId: data.returnTransferId || null,
        saloonId: data.saloonId || null,
        resTableId: data.resTableId || null,
        menuId: data.menuId || null,

        // transfers ilişkisi
        transfers: data.transfers && data.transfers.length > 0
          ? {
              create: data.transfers.map((t: any) => ({
                personQuantity: t.personQuantity,
                time: t.time,
                transferDesc: t.transferDesc,
                transferLocationId: t.transferLocationId,
                transferPointId: t.transferPointId,
                driverId: t.driverId || null,
              })),
            }
          : undefined,
      },
      include: {
        transfers: true,
        fromWho: true,
        resTaker: true,
        authorized: true,
        arrivalTransfer: true,
        returnTransfer: true,
        saloon: true,
        resTable: true,
        menu: true,
      },
    });

    res.status(201).json(created);
  } catch (error: any) {
    console.error("Reservation creation error:", error.message);
    console.error("Full error object:", error);
    res.status(500).json({
      error: "Reservation creation failed",
      message: error.message,
    });
  }
});



// READ ALL - Tüm rezervasyonları listele
app.get("/api/reservations", async (req, res) => {
  try {
    const reservations = await prisma.reservation.findMany({
      include: {
        fromWho: true,
        resTaker: true,
        authorized: true,
        arrivalTransfer: true,
        returnTransfer: true,
        saloon: true,
        resTable: true,
        menu: true,
        transfers: true,
      },
      orderBy: { date: "desc" },
    });
    res.json(reservations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch reservations" });
  }
});

// READ ONE - ID ile rezervasyon getir
app.get("/api/reservations/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const reservation = await prisma.reservation.findUnique({
      where: { id },
      include: {
        fromWho: true,
        resTaker: true,
        authorized: true,
        arrivalTransfer: true,
        returnTransfer: true,
        saloon: true,
        resTable: true,
        menu: true,
        transfers: true,
      },
    });
    if (!reservation) {
      return res.status(404).json({ error: "Reservation not found" });
    }
    res.json(reservation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch reservation" });
  }
});

// UPDATE - ID ile rezervasyon güncelle
app.put("/api/reservations/:id", async (req, res) => {
  const reservationId = req.params.id;
  const data = req.body;

  try {
    // Önceki transferleri bul
    const existingTransfers = await prisma.transfer.findMany({
      where: { reservationId }
    });

    // Silinmesi gerekenler
    const deletedTransferIds = data.deletedTransferIds || [];
    await prisma.transfer.deleteMany({
      where: { id: { in: deletedTransferIds } }
    });

    // Transfer işlemleri
    const transferOperations = data.transfers?.map((t: any) => {
      if (t.id) {
        // Güncelle
        return prisma.transfer.update({
          where: { id: t.id },
          data: {
            personQuantity: t.personQuantity,
            time: t.time,
            transferDesc: t.transferDesc,
            transferLocationId: t.transferLocationId,
            transferPointId: t.transferPointId,
            driverId: t.driverId || null,
          },
        });
      } else {
        // Yeni transfer yarat
        return prisma.transfer.create({
          data: {
            personQuantity: t.personQuantity,
            time: t.time,
            transferDesc: t.transferDesc,
            transferLocationId: t.transferLocationId,
            transferPointId: t.transferPointId,
            driverId: t.driverId || null,
            reservationId,
          },
        });
      }
    });

    await Promise.all(transferOperations || []);

    // Reservation update
    const updatedReservation = await prisma.reservation.update({
      where: { id: reservationId },
      data: {
        date: data.date ? new Date(data.date) : undefined,
        paymentType: data.paymentType,
        room: data.room,
        voucherNo: data.voucherNo,
        nationality: data.nationality,
        description: data.description,
        transferNote: data.transferNote,
        ship: data.ship,
        fromWhoId: data.fromWhoId || null,
        resTakerId: data.resTakerId,
        authorizedId: data.authorizedId,
        arrivalTransferId: data.arrivalTransferId || null,
        returnTransferId: data.returnTransferId || null,
        saloonId: data.saloonId,
        resTableId: data.resTableId,
        menuId: data.menuId,
      },
      include: {
        transfers: true,
        fromWho: true,
        resTaker: true,
        authorized: true,
        arrivalTransfer: true,
        returnTransfer: true,
        saloon: true,
        resTable: true,
        menu: true,
      },
    });

    res.json(updatedReservation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update reservation" });
  }
});


// DELETE - ID ile rezervasyon sil
app.delete("/api/reservations/:id", async (req, res) => {
  try {
    const id = req.params.id;

    await prisma.reservation.delete({
      where: { id },
    });

    res.json({ message: "Reservation deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete reservation" });
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
    const employeesSafe = employees.map((emp: typeof employees[0]) => ({
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
app.post("/api/employees", async (req, res) => {
  const { groupId, name, lastname, phone, username, password } = req.body;

  try {
    const newEmployee = await prisma.employee.create({
      data: {
        name,
        lastname,
        phone: Number(phone),
        username,
        password: password || null, // opsiyonel olabilir
        group: {
          connect: { id: groupId }, // ❗ İlişkiyi bu şekilde kurman gerekir
        },
      },
    });

    res.status(201).json(newEmployee);
  } catch (error: any) {
    console.error("POST /api/employees error:", error.message, error.stack);
    res.status(500).json({ error: error.message });
  }
});


// Login endpoint
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body as { username: string; password: string }; // <--- BURAYA DİKKAT

  try {
    const user = await prisma.employee.findUnique({
      where: { username }, // artık tip uyumlu
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
        phone: Number(phone),
        username,
        group: { connect: { id: groupId } },
      }
    });
    const updatedSafe = { ...updated, phone: updated.phone.toString() };
    sendJsonSafe(res, updatedSafe);
  } catch (error) {
    console.error('PUT /api/employees/:id error', error);
    res.status(500).json({ error: 'Failed to update employee' });
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
    res.status(500).json({ error: 'Failed to delete employee' });
  }
});

app.get('/api/clients', async (req, res) => {
  try {
    console.log("API çağrısı başladı");
    const clients = await prisma.client.findMany({
      include: { whoCreated: true, whoUpdated: true }
    });
    console.log(`Client sayısı: ${clients.length}`);

    // BigInt vs sorun olursa JSON stringify içinde dönüştür
    const safeClients = JSON.parse(JSON.stringify(clients, (_, value) =>
      typeof value === 'bigint' ? value.toString() : value
    ));

    return res.json(safeClients);
  } catch (error: any) {
    console.error("❌ GET /api/clients hata:", error);
    // Hata detayını hem konsola hem istemciye gönderelim
    return res.status(500).json({
      error: error.message || 'Server error',
      stack: error.stack || null
    });
  }
});

app.post('/api/clients', async (req, res) => {
  try {
    const { company, clientType, currency, tax, limit, whoCreatedId } = req.body;

    if (!whoCreatedId) {
      return res.status(400).json({ error: 'whoCreatedId is required' });
    }

    const newClient = await prisma.client.create({
      data: {
        company,
        clientType,
        currency,
        tax,
        limit,
        createdAt: new Date(),
        whoCreated: { connect: { id: whoCreatedId } },
      },
      include: {
        whoCreated: true,
        whoUpdated: true,
      },
    });

    res.status(201).json(newClient);
  } catch (error) {
    console.error('POST /api/clients error:', error);
    res.status(500).json({ error: 'Failed to add client' });
  }
});

app.delete('/api/clients/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.client.delete({
      where: { id },
    });
    res.json({ message: 'Client deleted successfully' });
  } catch (error) {
    console.error('DELETE /api/clients/:id error:', error);
    res.status(500).json({ error: 'Failed to delete client' });
  }
});
app.put('/api/clients/:id', async (req, res) => {
  console.log("📡 Update request body:", req.body);
  try {
    const { id } = req.params;
    const { company, clientType, currency, tax, limit, whoUpdatedId } = req.body;

    if (!whoUpdatedId) {
      return res.status(400).json({ error: 'whoUpdatedId is required' });
    }

    const clientExists = await prisma.client.findUnique({ where: { id } });
    if (!clientExists) {
      return res.status(404).json({ error: 'Client not found' });
    }

    const employee = await prisma.employee.findUnique({ where: { id: whoUpdatedId } });
    if (!employee) {
      return res.status(400).json({ error: 'Employee not found for whoUpdatedId' });
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

  } catch (error: unknown) {
    console.error('PUT /api/clients/:id error:', error);

    // Hata nesnesini stringify ederken BigInt varsa stringe çeviren fonksiyon
    function safeErrorObj(err: any) {
      return JSON.parse(safeJsonStringify({
        message: err.message,
        stack: err.stack,
        name: err.name,
      }));
    }

    const errorPayload = {
      error: 'Failed to update client',
      ...safeErrorObj(error),
    };

    res.status(500);
    sendJsonSafe(res, errorPayload);
    return;
  }
});

// GET all tables
app.get('/api/restables', async (req, res) => {
  try {
    const tables = await prisma.resTable.findMany({
      orderBy: {
        id: 'asc' // en son eklenen en sonda görünür
      },
      include: {
        saloon: true
      }
    });
    res.json(tables);
  } catch (error) {
    console.error('GET /api/restables error:', error);
    res.status(500).json({ error: 'Masalar listelenemedi' });
  }
});

// GET one table by id
app.get('/api/restables/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const table = await prisma.resTable.findUnique({
      where: { id },
      include: { saloon: true }
    });
    if (!table) return res.status(404).json({ error: 'Masa bulunamadı' });
    res.json(table);
  } catch (error) {
    console.error('GET /api/restables/:id error:', error);
    res.status(500).json({ error: 'Masa getirilemedi' });
  }
});

// POST create new table
app.post('/api/restables', async (req, res) => {
  try {
    const { name, capacity, saloonId } = req.body;
    if (!name || !capacity || !saloonId) {
      return res.status(400).json({ error: 'name, capacity ve saloonId zorunludur' });
    }
    const newTable = await prisma.resTable.create({
      data: {
        name,
        capacity: Number(capacity),
        saloon: { connect: { id: saloonId } }
      },
      include: { saloon: true }
    });
    res.status(201).json(newTable);
  } catch (error) {
    console.error('POST /api/restables error:', error);
    res.status(500).json({ error: 'Masa oluşturulamadı' });
  }
});

// PUT update existing table
app.put('/api/restables/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, capacity, saloonId } = req.body;
    const updated = await prisma.resTable.update({
      where: { id },
      data: {
        name,
        capacity: Number(capacity),
        saloon: { connect: { id: saloonId } }
      },
      include: { saloon: true }
    });
    res.json(updated);
  } catch (error) {
    console.error('PUT /api/restables/:id error:', error);
    res.status(500).json({ error: 'Masa güncellenemedi' });
  }
});

// DELETE table by id
app.delete('/api/restables/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.resTable.delete({ where: { id } });
    res.json({ message: 'Masa silindi' });
  } catch (error) {
    console.error('DELETE /api/restables/:id error:', error);
    res.status(500).json({ error: 'Masa silinemedi' });
  }
});


app.get('/api/transfer-locations', async (req, res) => {
  try {
    const locations = await prisma.transferLocation.findMany();
    res.json(locations);
  } catch (error) {
    console.error("GET /api/transfer-locations error:", error);
    res.status(500).json({ error: "Transfer locations fetch error" });
  }
});

app.post('/api/transfer-locations', async (req, res) => {
  try {
    const { locationName, time, description } = req.body;
    const newLocation = await prisma.transferLocation.create({
      data: {
        locationName,
        time,
        description
      }
    });
    res.status(201).json(newLocation);
  } catch (error) {
    console.error("POST /api/transfer-locations error:", error);
    res.status(500).json({ error: "Transfer location create error" });
  }
});

app.put('/api/transfer-locations:id', async (req, res) => {
  const { id } = req.params;
  const { locationName, time, description } = req.body;

  try {
    const updated = await prisma.transferLocation.update({
      where: { id },
      data: {
        locationName,
        time,
        description,
      }
    });
    res.json(updated);
  } catch (error) {
    console.error("PUT /api/transfer-locations/:id error:", error);
    res.status(500).json({ error: "Transfer location update error" });
  }
});

app.delete('/api/transfer-locations/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.transferLocation.delete({ where: { id } });
    res.json("Deleted successfully");
  } catch (error) {
    console.error("DELETE /api/transfer-locations/:id error:", error);
    res.status(500).json({ error: "Transfer location delete error" });
  }
});

//Transfer Locations endpoints

app.get("/api/transfer-points", async (req, res) => {
  try {
    const points = await prisma.transferPoint.findMany();
    res.json(points);
  } catch (error) {
    console.error("Transfer points fetch error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.post("/api/transfer-points", async (req, res) => {
  try {
    const point = await prisma.transferPoint.create({
      data: req.body,
    });
    res.json(point);
  } catch (error) {
    console.error("Create transfer point error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// TransferPoint PUT
app.put("/api/transfer-points/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const point = await prisma.transferPoint.update({
      where: { id },
      data: req.body,
    });
    res.json(point);
  } catch (error) {
    console.error("Update transfer point error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// TransferPoint DELETE
app.delete("/api/transfer-points/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.transferPoint.delete({ where: { id } });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("Delete transfer point error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
//-----

app.get('/api/saloons', async (req, res) => {
  try {
    const saloons = await prisma.saloon.findMany();
    res.status(200).json(saloons);
  } catch (error) {
    console.error("Salon listeleme hatası:", error);
    res.status(500).json({ error: "Sunucu hatası" });
  }
});

app.post('/api/saloons', async (req, res) => {
  try {
    const { ship, saloonName, description } = req.body;
    if (!ship || !saloonName) {
      return res.status(400).json({ error: "Ship ve Salon isimlerini giriniz" });
    }
    const newSaloon = await prisma.saloon.create({
      data: {
        ship,
        saloonName,
        description,
      }
    });
    res.status(201).json(newSaloon);
  } catch (error) {
    console.error("Saloon oluşturma hatası:", error);
    res.status(500).json({ error: "Sunucu hatası" });
  }
});

app.put('/api/saloons/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { ship, saloonName, description } = req.body;
    const updatedSaloon = await prisma.saloon.update({
      where: { id },
      data: {
        ship,
        saloonName,
        description,
      }
    });
    res.status(200).json(updatedSaloon);
  } catch (error) {
    console.error("Saloon güncelleme hatası:", error);
    res.status(500).json({ error: "Sunucu hatası" });
  }
});

app.delete('/api/saloons/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.saloon.delete({ where: { id } });
    res.status(200).json({ message: "Saloon silindi." });
  } catch (error) {
    console.error("Saloon silme hatası:", error);
    res.status(500).json({ error: "Sunucu hatası" });
  }
});

// Genel Fiyat Tanımları endpoint

app.get('/api/general-incomes', async (req, res) => {
  try {
    const incomes = await prisma.generalIncome.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(incomes);
  } catch (err: unknown) {
    console.error('GET /api/general-incomes error:', err);
    res.status(500).json({ error: 'Gelirler alınamadı' });
  }
});

app.post('/api/general-incomes', async (req, res) => {
  try {
    const data = req.body;
    const newIncome = await prisma.generalIncome.create({
      data: {
        ...data,
        flierPrice: Number(data.flierPrice),
        otelPrice: Number(data.otelPrice),
        fiveAndFarPrice: Number(data.fiveAndFarPrice),
        agencyPrice: Number(data.agencyPrice),
        guidePrice: Number(data.guidePrice),
        individualPrice: Number(data.individualPrice),
        companyPrice: Number(data.companyPrice),
        onlinePrice: Number(data.onlinePrice),
        othersPrice: Number(data.othersPrice),
        startedAt: new Date(data.startedAt),
        endedAt: new Date(data.endedAt),
      }
    });
    res.status(201).json(newIncome);
  } catch (err: unknown) {
    console.error('PUT /api/general-incomes error:', err);
    res.status(500).json({ error: 'Gelir oluşturulamadı' });
  }
});

app.put('/api/general-incomes:id', async (req, res) => {
  const { id } = req.params;
  const {
    menuName,
    currency,
    flierPrice,
    otelPrice,
    fiveAndFarPrice,
    agencyPrice,
    guidePrice,
    individualPrice,
    companyPrice,
    onlinePrice,
    othersPrice,
    startedAt,
    endedAt,
  } = req.body;
  try {
    const updatedIncome = await prisma.generalIncome.update({
      where: { id },
      data: {
        menuName,
        currency,
        flierPrice: Number(flierPrice),
        otelPrice: Number(otelPrice),
        fiveAndFarPrice: Number(fiveAndFarPrice),
        agencyPrice: Number(agencyPrice),
        guidePrice: Number(guidePrice),
        individualPrice: Number(individualPrice),
        companyPrice: Number(companyPrice),
        onlinePrice: Number(onlinePrice),
        othersPrice: Number(othersPrice),
        startedAt: new Date(startedAt),
        endedAt: new Date(endedAt),
      }
    });
    res.json(updatedIncome);
  } catch (err: unknown) {
    console.error('PUT /api/general-incomes/:id error:', err);
    res.status(500).json({ error: 'Gelir güncellenemedi' });
  }
});

app.delete('/api/general-incomes:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.generalIncome.delete({ where: { id } });
    res.status(204).end();
  } catch (err: unknown) {
    console.error('Delete /api/general-incomes error:', err);
    res.status(500).json({ err: 'Gelir silinemedi' });
  }
});

app.get("/api/company-rates", async (req, res) => {
  try {
    const rates = await prisma.companyRate.findMany();
    res.json(rates);
  } catch (error) {
    res.status(500).json({ error: "Fetch failed" });
  }
});

app.post("/api/company-rates", async (req, res) => {
  try {
    const newRate = await prisma.companyRate.create({
      data: {
        ...req.body,
        createdAt: new Date()
      },
    });
    res.json(newRate);
  } catch (error) {
    console.error("Create error:", error);
    res.status(500).json({ error: "Create failed" });
  }
});

app.put("/api/company-rates/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const updatedRate = await prisma.companyRate.update({
      where: { id },
      data: req.body,
    });
    res.json(updatedRate);
  } catch (error) {
    res.status(500).json({ error: "Update failed" });
  }
});

app.delete("/api/company-rates/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.companyRate.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Delete failed" });
  }
});


// Sağlık testi
app.get('/test', (req, res) => {
  res.send('Server is working!');
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`✅ Server running on http://localhost:${port}`);
});

export default app;