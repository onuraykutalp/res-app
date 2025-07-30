import { ReservationInput } from "../types/Reservation";

export function transformReservationInput(input: ReservationInput) {
  const m1Count = input.m1.full + input.m1.half + input.m1.infant + input.m1.guide;
  const m2Count = input.m2.full + input.m2.half + input.m2.infant + input.m2.guide;
  const m3Count = input.m3.full + input.m3.half + input.m3.infant + input.m3.guide;
  const v1Count = input.v1.full + input.v1.half + input.v1.infant + input.v1.guide;
  const v2Count = input.v2.full + input.v2.half + input.v2.infant + input.v2.guide;

  const full = input.m1.full + input.m2.full + input.m3.full + input.v1.full + input.v2.full;
  const half = input.m1.half + input.m2.half + input.m3.half + input.v1.half + input.v2.half;
  const infant = input.m1.infant + input.m2.infant + input.m3.infant + input.v1.infant + input.v2.infant;
  const guide = input.m1.guide + input.m2.guide + input.m3.guide + input.v1.guide + input.v2.guide;

  const totalPerson = full + half + infant + guide;

  return {
    ...input,
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
  };
}
