import { Saloon } from "./Saloon";

export interface ResTable {
    id: string,
    name: string,
    capacity: number,
    saloon: Saloon;
}