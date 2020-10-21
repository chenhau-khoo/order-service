import { OrderStatus } from "src/modules/shared/order-status.enum";

export class CreateOrderResp {
    id: string;
    status: OrderStatus;
}