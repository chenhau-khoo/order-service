import { OrderStatus } from "src/shared/order-status.enum";
import { Timestamp } from "typeorm";

export class GetOrderResp {
    id: string;
    status: OrderStatus;
    createdOn: Date;
    updatedOn: Date;
}