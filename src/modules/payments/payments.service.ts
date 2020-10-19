import { HttpService, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MakePaymentReq } from './dto/make-payment.req';
import { MakePaymentResp } from './dto/make-payment.resp';

@Injectable()
export class PaymentsService {
    constructor(private readonly httpService: HttpService,
        private configService: ConfigService) { }

    makePayment(req: MakePaymentReq): Observable<MakePaymentResp> {
        return this.httpService.post(this.configService.get('PAYMENT_API_URL') + '/payment', req)
            .pipe(
                map(resp => resp.data)
            );
    }
}
