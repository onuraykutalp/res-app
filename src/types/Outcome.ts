import { OutcomeGroup } from "./OutcomeGroup";

export interface Outcome{
    id: string,
    groupId : string,
    group: OutcomeGroup,
    name: string,
    ship: boolean,
    accountant: boolean
    createdAt: string,
}