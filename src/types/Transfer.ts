import { Driver } from "./Driver";
import { Reservation } from "./Reservation";
import { TransferLocation } from "./TransferLocation";
import { TransferPoint } from "./TransferPoint";

export interface Transfer {
  id: string;
  driver?: Driver;
  personQuantity: number;
  time: string;
  transferDesc?: string;

  transferLocationId: string;
  transferPointId: string;
  reservationId?: string;

  // Gerekirse ilişkiler dahil edilir
  transferLocation?: TransferLocation;
  transferPoint?: TransferPoint;
  reservation?: Reservation;
}