import { PaymentStatus } from "src/modules/shared/payment-status.enum";

export class MakePaymentResp {
    paymentId: string;
    paymentStatus: PaymentStatus;
}