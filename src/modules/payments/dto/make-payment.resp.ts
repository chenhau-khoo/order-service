import { PaymentStatus } from '../const/payment-status.enum';

export class MakePaymentResp {
    paymentId: string;
    paymentStatus: PaymentStatus;
}