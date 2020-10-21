import { OrderStatus } from "src/modules/orders/const/order-status.enum";

export class CreateOrderResp {
    id: string;
    status: OrderStatus;
}