import { OrderStatus } from "src/shared/order-status.enum";

export class GetOrderResp {
    id: string;
    status: OrderStatus;
}