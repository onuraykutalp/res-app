import { ExpenseGroup } from "./ExpenseGroup";

export interface Expense {
    id: string,
    expenseGroupName: ExpenseGroup,
    expenseGroupId: string,
    expenseName: string,
    ship: boolean,
    accountant: boolean,
    createdAt: string,
}