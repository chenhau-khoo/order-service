import { OrderStatus } from "src/shared/order-status.enum";

export class CreateOrderResp {
    id: string;
    status: OrderStatus;
}