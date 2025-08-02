import { ReservationInput, MenuPersonCount } from "../types/Reservation";

// Menüdeki toplam kişi sayısını hesaplayan yardımcı fonksiyon
function countMenuPersons(menu: MenuPersonCount): number {
  return (
    (menu.full || 0) +
    (menu.half || 0) +
    (menu.infant || 0) +
    (menu.guide || 0)
  );
}

// ReservationInput'tan backend için uygun veriye dönüştüren fonksiyon
export function transformReservationInput(data: ReservationInput): any {
  const totalM1 = countMenuPersons(data.m1);
  const totalM2 = countMenuPersons(data.m2);
  const totalM3 = countMenuPersons(data.m3);
  const totalV1 = countMenuPersons(data.v1);
  const totalV2 = countMenuPersons(data.v2);

  return {
    date: data.date,
    room: data.room || null,
    voucherNo: data.voucherNo || null,
    nationality: data.nationality || null,
    description: data.description || null,
    transferNote: data.transferNote || null,
    ship: data.ship || "",

    companyRateId: data.companyRateId,
    resTakerId: data.resTakerId,
    authorizedId: data.authorizedId,
    saloonId: data.saloonId,
    resTableId: data.resTableId,

    arrivalTransfer: data.arrivalTransfer || null,
    returnTransfer: data.returnTransfer || null,
    arrivalLocation: data.arrivalLocation || null,
    returnLocation: data.returnLocation || null,

    m1: totalM1,
    m2: totalM2,
    m3: totalM3,
    v1: totalV1,
    v2: totalV2,

    full:
      (data.m1.full || 0) +
      (data.m2.full || 0) +
      (data.m3.full || 0) +
      (data.v1.full || 0) +
      (data.v2.full || 0),

    half:
      (data.m1.half || 0) +
      (data.m2.half || 0) +
      (data.m3.half || 0) +
      (data.v1.half || 0) +
      (data.v2.half || 0),

    infant:
      (data.m1.infant || 0) +
      (data.m2.infant || 0) +
      (data.m3.infant || 0) +
      (data.v1.infant || 0) +
      (data.v2.infant || 0),

    guide:
      (data.m1.guide || 0) +
      (data.m2.guide || 0) +
      (data.m3.guide || 0) +
      (data.v1.guide || 0) +
      (data.v2.guide || 0),

    totalPerson: totalM1 + totalM2 + totalM3 + totalV1 + totalV2,

    tour: Array.isArray(data.tour) ? data.tour.join(",") : data.tour,
    paymentType: data.paymentType,

    moneyReceived: data.moneyReceived,
    moneyToPayCompany: data.moneyToPayCompany,

    fullPrice: data.fullPrice,
  };
}
