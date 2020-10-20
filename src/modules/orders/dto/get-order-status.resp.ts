import { OrderStatus } from "src/shared/order-status.enum";

export class GetOrderStatusResp {
    id: string;
    status: OrderStatus;
    deliveredBy: string;
}