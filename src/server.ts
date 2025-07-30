import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { PaymentType } from "@prisma/client";
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

async function generateUniqueReservationNo(): Promise<number> {
  // En son oluşturulan rezervasyonun reservationNo değerini al
  const lastReservation = await prisma.reservation.findFirst({
    orderBy: { reservationNo: "desc" },
  });

  // Eğer hiç rezervasyon yoksa 1 ile başla, varsa 1 artır
  return lastReservation ? lastReservation.reservationNo + 1 : 1;
}

// JSON cevap göndermek için BigInt'leri stringe çevirip gönderen fonksiyon
function sendJsonSafe(res: express.Response, data: any) {
  const json = safeJsonStringify(data);
  res.setHeader('Content-Type', 'application/json');
  res.send(json);
}


// GET /api/reservations
// GET /api/reservations
app.get("/api/reservations", async (req, res) => {
  try {
    const reservations = await prisma.reservation.findMany({
      include: {
        companyRate: true,
        resTaker: true,
        authorized: true,
        saloon: true,
        resTable: true,
      },
    });
    res.status(200).json(reservations);
  } catch (error) {
    console.error("HATA /api/reservations:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// POST /api/reservations
app.post("/api/reservations", async (req, res) => {
  try {
    const {
  date,
  m1Count,
  m2Count,
  m3Count,
  v1Count,
  v2Count,
  full,
  half,
  infant,
  guide,
  totalPerson,
  arrivalTransfer,
  returnTransfer,
  tour,
  companyRateId,
  paymentType,
  resTableId,
  saloonId,
  resTakerId,
  authorizedId,

  // Bunları EKLE:
  arrivalLocation,
  returnLocation,
} = req.body;

    // Zorunlu alanlar kontrolü
    if (!date || !companyRateId || !resTakerId || !authorizedId || !paymentType) {
      console.log("Eksik zorunlu alan:", { date, companyRateId, resTakerId, authorizedId, paymentType });
      return res.status(400).json({ error: "Zorunlu alanlar eksik" });
    }

    const validPaymentTypes = ["Gemide", "Cari", "Comp", "Komisyonsuz"];
    if (!validPaymentTypes.includes(paymentType)) {
      return res.status(400).json({ error: "Geçersiz paymentType" });
    }

    // companyRate kontrolü
    const companyRate = await prisma.companyRate.findUnique({
      where: { id: companyRateId },
    });
    if (!companyRate) {
      return res.status(400).json({ error: "Geçersiz companyRateId" });
    }

    // fullPrice hesaplama
    const fullPrice =
      (companyRate.m1 ?? 0) * (m1Count ?? 0) +
      (companyRate.m2 ?? 0) * (m2Count ?? 0) +
      (companyRate.m3 ?? 0) * (m3Count ?? 0) +
      (companyRate.v1 ?? 0) * (v1Count ?? 0) +
      (companyRate.v2 ?? 0) * (v2Count ?? 0);

    // reservationNo üret
    const reservationNo = await generateUniqueReservationNo();

    const isoDate = new Date(date);
    if (isNaN(isoDate.getTime())) {
      return res.status(400).json({ error: "Geçersiz tarih formatı" });
    }

    // Rezervasyon oluştur
    const newReservation = await prisma.reservation.create({
  data: {
    reservationNo,
    date: new Date(date), // date: ISO string ya da Date objesi
    m1: m1Count ?? 0,
    m2: m2Count ?? 0,
    m3: m3Count ?? 0,
    v1: v1Count ?? 0,
    v2: v2Count ?? 0,
    full: full ?? 0,
    half: half ?? 0,
    infant: infant ?? 0,
    guide: guide ?? 0,
    totalPerson: totalPerson ?? 0,
    fullPrice,
    tour: Array.isArray(tour) ? tour.join(",") : "",
    moneyReceived: 0,
    moneyToPayCompany: 0,
    paymentType,

    // Foreign key bağlantıları (zorunlu)
    companyRate: { connect: { id: companyRateId } },
    resTaker:    { connect: { id: resTakerId } },
    authorized:  { connect: { id: authorizedId } },

    // Nullable alanlar (undefined gönderilebilir)
    saloon:      saloonId ? { connect: { id: saloonId } } : undefined,
    resTable:    resTableId ? { connect: { id: resTableId } } : undefined,

    arrivalTransfer: arrivalTransfer || null,
    returnTransfer: returnTransfer || null,
    arrivalLocation: arrivalLocation || null,
    returnLocation: returnLocation || null,

    // Eğer backendde companyDebtId set edilecekse — şu an edilmiyor:
    // companyDebt: companyDebtId ? { connect: { id: companyDebtId } } : undefined,

    createdAt: new Date(),
  }
});



    // Şimdi companyDebt'yi companyRate.company bilgisi üzerinden bulup güncelle
    if ((paymentType === "Gemide" || paymentType === "Cari") && companyRate.company) {
      const companyDebt = await prisma.companyDebt.findFirst({
        where: {
          name: companyRate.company,
        },
      });

      if (companyDebt) {
        await prisma.companyDebt.update({
          where: { id: companyDebt.id },
          data: {
            debt: Number(companyDebt.debt) + Number(fullPrice),
            balance: Number(companyDebt.balance) - Number(fullPrice),
          },
        });
      } else {
        console.warn("CompanyDebt bulunamadı:", companyRate.company);
      }
    }

    console.log("Zorunlu alanlar:", { resTakerId, authorizedId, paymentType });
    return res.status(201).json(newReservation);
  } catch (error) {
    console.error("POST /api/reservations error:", error instanceof Error ? error.stack : error);
    res.status(500).json({ error: error instanceof Error ? error.message : "Sunucu hatası" });
  }
});

// Örnek Express.js route
app.get("/api/company-debts/:companyRateId", async (req, res) => {
  const { companyRateId } = req.params;
  try {
    const companyDebt = await prisma.companyDebt.findFirst({
      where: { companyRateId: companyRateId },
    });

    if (!companyDebt) {
      return res.status(404).json({ error: "CompanyDebt not found" });
    }

    res.json(companyDebt);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Sunucu hatası" });
  }
});



// PUT /api/reservations/:id
app.put("/api/reservations/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const {
      m1 = 0,
      m2 = 0,
      m3 = 0,
      v1 = 0,
      v2 = 0,
      full = 0,
      half = 0,
      infant = 0,
      guide = 0,
      arrivalTransfer,
      returnTransfer,
      companyRateId,
      ...rest
    } = req.body;

    const totalPerson = full + half + infant + guide;

    const menuMap: Record<string, string> = {
      m1: "M1",
      m2: "M2",
      m3: "M3",
      v1: "V1",
      v2: "V2",
    };
    const counts = { m1, m2, m3, v1, v2 };
    const tourParts = Object.entries(counts)
      .filter(([_, value]) => value > 0)
      .map(([key, value]) => `${value}-${menuMap[key]}`);
    const tour = tourParts.join(", ");

    const isValidPaymentType = (val: any): val is PaymentType =>
      ["Gemide", "Cari", "Comp", "Komisyonsuz"].includes(val);

    const paymentType: PaymentType = isValidPaymentType(rest.paymentType)
      ? rest.paymentType
      : "Gemide";

    const updatedReservation = await prisma.reservation.update({
      where: { id },
      data: {
        ...rest,
        paymentType,
        m1,
        m2,
        m3,
        v1,
        v2,
        full,
        half,
        infant,
        guide,
        totalPerson,
        arrivalTransfer,
        returnTransfer,
        tour,
        companyRateId,
      },
    });

    res.json(updatedReservation);
  } catch (error) {
    console.error("Update reservation error:", error);
    res.status(500).json({ error: "Reservation update failed" });
  }
});

// DELETE /api/reservations/:id
app.delete("/api/reservations/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.reservation.delete({ where: { id } });
    res.json({ message: "Reservation deleted successfully" });
  } catch (error) {
    console.error("Delete reservation error:", error);
    res.status(500).json({ error: "Reservation deletion failed" });
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
app.get("/api/employees", async (req, res) => {
  console.log("GET /api/employees called");
  try {
    const employees = await prisma.employee.findMany({
      include: { group: true },
    });

    // phone zaten string ama yine güvenlik için toString kullandım
    const employeesSafe = employees.map((emp) => ({
      ...emp,
      phone: emp.phone?.toString() ?? "",
    }));

    sendJsonSafe(res, employeesSafe);
  } catch (error) {
    console.error("GET /api/employees error:", error);
    res.status(500).json({ error: "Failed to fetch employees" });
  }
});

// POST /api/employees
app.post("/api/employees", async (req, res) => {
  try {
    const { groupId, phone, ...rest } = req.body;

    if (!groupId) {
      return res.status(400).json({ error: "groupId is required" });
    }

    if (!phone) {
      return res.status(400).json({ error: "phone is required" });
    }

    const newEmployee = await prisma.employee.create({
      data: {
        ...rest,
        phone: String(phone),
        group: {
          connect: { id: groupId },
        },
      },
    });

    res.json(newEmployee);
  } catch (error: any) {
    console.error("Create employee error:", error.message, error.stack);
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/employees/:id
app.put("/api/employees/:id", async (req, res) => {
  const { id } = req.params;
  const { name, lastname, phone, username, groupId } = req.body;

  console.log("PUT /api/employees/:id called");
  console.log("Params:", req.params);
  console.log("Body:", req.body);

  if (!id) {
    return res.status(400).json({ error: "Employee id is required" });
  }

  if (!groupId) {
    return res.status(400).json({ error: "groupId is required" });
  }

  if (!phone) {
    return res.status(400).json({ error: "phone is required" });
  }

  try {
    const updated = await prisma.employee.update({
      where: { id },
      data: {
        name,
        lastname,
        phone: String(phone),
        username,
        group: {
          connect: { id: groupId },
        },
      },
    });

    res.json(updated);
  } catch (error) {
    console.error("PUT /api/employees/:id error", error);
    res.status(500).json({ error: "Failed to update employee" });
  }
});

// DELETE /api/employees/:id
app.delete("/api/employees/:id", async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Employee id is required" });
  }

  try {
    await prisma.employee.delete({
      where: { id },
    });

    res.json({ message: "Deleted Successfully" });
  } catch (error) {
    console.error("DELETE /api/employees/:id error:", error);
    res.status(500).json({ error: "Failed to delete employee" });
  }
});


// POST /api/login
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body as {
    username: string;
    password: string;
  };

  try {
    const user = await prisma.employee.findUnique({
      where: { username },
    });

    if (!user || !user.password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        lastname: user.lastname,
        groupId: user.groupId,
      },
    });
  } catch (error) {
    console.error("POST /api/login error:", error);
    res.status(500).json({ error: "Internal server error" });
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
    const points = await prisma.transferPoint.findMany({
      include: {
        location: true,
      },
    });
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

// --- COMPANY RATES ---
app.get("/api/company-rates", async (req, res) => {
  try {
    const rates = await prisma.companyRate.findMany();
    res.json(rates);
  } catch (error) {
    res.status(500).json({ error: "deneme 1-2" });
  }
});

app.post("/api/company-rates", async (req, res) => {
  try {
    const { company, companyType, currency, tax, startDate, endDate, ...rest } = req.body;

    // Yeni CompanyRate oluştur
    const newRate = await prisma.companyRate.create({
      data: {
        company,
        companyType,  // varsa
        currency,
        tax,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        createdAt: new Date(),
        ...rest,
      },
    });

    // Aynı ID ile CompanyDebt oluştur (debt, credit, balance sıfır)
    await prisma.companyDebt.create({
      data: {
        id: newRate.id,               // Bu idyi kullanabilirsin, veya yeni id üretebilirsin
        companyRateId: newRate.id,    // BURADA MUTLAKA EKLENMELİ
        name: company,
        companyType: companyType || "default", // zorunluysa mutlaka ver
        currency,
        tax: tax || 0,
        debt: 0,
        credit: 0,
        balance: 0,
        createdAt: new Date(),
      },
    });

    res.json(newRate);
  } catch (error: any) {
    console.error("CompanyRate create error:", error); // detaylı hata
    res.status(500).json({ error: error.message || "Create failed" });
  }
});



app.put("/api/company-rates/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const updatedRate = await prisma.companyRate.update({
      where: { id },
      data: {
        ...req.body,
        startDate: new Date(req.body.startDate),
        endDate: new Date(req.body.endDate),
      }
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

// Company Debts Endpoints

app.get("/api/company-debts", async (req, res) => {
  try {
    const debts = await prisma.companyDebt.findMany({
      include: {
        reservations: true,  // İstersen rezervasyonları da çekebilirsin
      },
    });
    res.json(debts);
  } catch (error) {
    console.error("Fetch companyDebts error:", error);
    res.status(500).json({ error: "Failed to fetch company debts" });
  }
});

app.put("/api/company-debts/:id", async (req, res) => {
  const id = req.params.id;
  const { name, companyType, currency, tax, debt, credit, balance } = req.body;

  try {
    const updatedDebt = await prisma.companyDebt.update({
      where: { id },
      data: {
        name,
        companyType,
        currency,
        tax,
        debt,
        credit,
        balance,
      },
    });
    res.json(updatedDebt);
  } catch (error) {
    console.error("Update companyDebt error:", error);
    res.status(500).json({ error: "Failed to update company debt" });
  }
});


app.get('/api/outcome-groups', async (req, res) => {
  try {
    const outcomeGroups = await prisma.outcomeGroup.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(outcomeGroups);
  } catch (error) {
    console.error("Create reservation error:", error);
    return res.status(500).json({
      error: "Gider grupları alınamadı",
      details: error instanceof Error ? error.message : undefined,
    });
  }
});

app.post('/api/outcome-groups', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Gider grubu adı zorunludur" });
    }
    const newOutcomeGroup = await prisma.outcomeGroup.create({
      data: {
        name,
        createdAt: new Date(),
      },
    });
    res.json(newOutcomeGroup);
  } catch (error) {
    console.error("Create reservation error:", error);
    return res.status(500).json({
      error: "Gider oluşturulamadı",
      details: error instanceof Error ? error.message : undefined,
    });
  }
});

app.put('/api/outcome-groups/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Gider grubu adı zorunludur" });
    }
    const updatedOutcomeGroup = await prisma.outcomeGroup.update({
      where: { id },
      data: {
        name
      }
    });
    res.json(updatedOutcomeGroup);
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ error: "Gider grubu güncellenemedi" });
  }
});

app.delete('/api/outcome-groups/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.outcomeGroup.delete({ where: { id } });
    res.status(204).end();
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ error: "Gider grubu silinemedi" });
  }
});

app.get('/api/outcomes', async (req, res) => {
  try {
    const outComes = await prisma.outcome.findMany({
      include: {
        group: true,
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(outComes);
  } catch (error) {
    console.error("GET error:", error);
    res.status(500).json({ error: "Gider grupları alınamadı." });
  }
});

app.post('/api/outcomes', async (req, res) => {
  try {
    const { name, groupId, ship, accountant } = req.body;
    const newOutcome = await prisma.outcome.create({
      data: {
        name,
        ship,
        accountant,
        createdAt: new Date(),
        group: {
          connect: {
            id: groupId, // Bu ID, OutcomeGroup modelindeki `id` alanı olmalı
          },
        }
      }
    });
    res.json(newOutcome);
  } catch (error) {
    return res.status(500).json({
      error: "Gider oluşturulamadı",
      details: error instanceof Error ? error.message : undefined,
    });
  }
});

app.put('/api/outcomes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, groupId, ship, accountant } = req.body;
    const updatedOutcome = await prisma.outcome.update({
      where: { id },
      data: {
        name,
        group: {
          connect: { id: groupId }
        },
        ship,
        accountant,
      }
    });
    res.json(updatedOutcome);
  } catch (error) {
    console.error("PUT error:", error);
    res.status(500).json({ error: "Gider tipi düzenlenemedi" });
  }
});

app.delete('/api/outcomes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.outcome.delete({ where: { id } });
    res.status(204).end();
  } catch (error) {
    console.error("DELETE error", error);
    res.status(500).json({ error: "Gider tipi silinemedi" });
  }
});

app.get('/api/incomes/', async (req, res) => {
  try {
    const incomes = await prisma.income.findMany({
      orderBy: { 'createdAt': 'desc' }
    })
    res.json(incomes);
  } catch (error) {
    console.error("GET error", error);
    res.status(500).json({ error: "Gelir tipleri alınamadı." });
  }
});

app.post('/api/incomes', async (req, res) => {
  try {
    const { name, tax, ship, accountant } = req.body;
    const newIncome = await prisma.income.create({
      data: {
        name,
        tax,
        ship,
        accountant,
      }
    });
    res.json(newIncome);
  } catch (error) {
    return res.status(500).json({
      error: "Gelir tipi oluşturulamadı",
      details: error instanceof Error ? error.message : undefined,
    });
  }
});

app.put('/api/incomes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, tax, ship, accountant } = req.body;
    const updatedIncome = await prisma.income.update({
      where: { id },
      data: {
        name,
        tax,
        ship,
        accountant
      }
    });
    res.json(updatedIncome);
  } catch (error) {
    return res.status(500).json({
      error: "Gelir tipi oluşturulamadı",
      details: error instanceof Error ? error.message : undefined,
    });
  }
});

app.delete('/api/incomes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.income.delete({ where: { id } });
  } catch (error) {
    console.error("DELETE error", error);
    res.status(500).json({ error: "Gelir tipi silinemedi" });
  }
});

// ============== REGISTER ==============

app.get("/register", async (req, res) => {
  try {
    const registers = await prisma.register.findMany({
      include: {
        reservation: true,
        client: true,
        companyDebt: true,
        createdBy: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    res.json(registers);
  } catch (error) {
    console.error("Error fetching registers:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/register", async (req, res) => {
  try {
    const {
      ship,
      reservationId,
      clientId,
      companyDebtId,
      groupName,
      accountType,
      entry,
      out,
      currency,
      description,
      receiptDate,
      createdById,
    } = req.body;

    const newRegister = await prisma.register.create({
      data: {
        ship,
        reservationId,
        clientId,
        companyDebtId,
        groupName,
        accountType,
        entry,
        out,
        currency,
        description,
        receiptDate: new Date(receiptDate),
        createdById,
      },
    });

    res.status(201).json(newRegister);
  } catch (error) {
    console.error("Error creating register:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put("/register/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      ship,
      reservationId,
      clientId,
      companyDebtId,
      groupName,
      accountType,
      entry,
      out,
      currency,
      description,
      receiptDate,
      createdById,
    } = req.body;

    const updated = await prisma.register.update({
      where: { id },
      data: {
        ship,
        reservationId,
        clientId,
        companyDebtId,
        groupName,
        accountType,
        entry,
        out,
        currency,
        description,
        receiptDate: new Date(receiptDate),
        createdById,
      },
    });

    res.json(updated);
  } catch (error) {
    console.error("Error updating register:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/register/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.register.delete({
      where: { id },
    });

    res.json({ message: "Kasa kaydı silindi." });
  } catch (error) {
    console.error("Error deleting register:", error);
    res.status(500).json({ error: "Internal Server Error" });
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