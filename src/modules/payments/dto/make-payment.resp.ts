import { PaymentStatus } from "src/shared/payment-status.enum";

export class MakePaymentResp {
    paymentId: string;
    paymentStatus: PaymentStatus;
}