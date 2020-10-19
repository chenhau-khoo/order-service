import { OrderStatus } from "src/shared/order-status.enum";
import { Timestamp } from "typeorm";

export class GetOrderResp {
    id: string;
    amount: number;
    desc: string;
    status: OrderStatus;
    createdOn: Date;
    updatedOn: Date;
}