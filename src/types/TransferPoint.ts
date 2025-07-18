import { TransferLocation } from "./TransferLocation";

export interface TransferPoint {
  id: string;
  transferPointName: string;
  time: string;
  description?: string;
  createdAt: string;

  locationId: string;
  location?: TransferLocation;
}