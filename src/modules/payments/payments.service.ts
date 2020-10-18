import { HttpService, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MakePaymentReq } from './dto/make-payment.req';
import { MakePaymentResp } from './dto/make-payment.resp';

@Injectable()
export class PaymentsService {
    constructor(private readonly httpService: HttpService) { }

    makePayment(req: MakePaymentReq): Observable<MakePaymentResp> {
        return this.httpService.post('http://localhost:3001/payment', req)
            .pipe(
                map(resp => resp.data)
            );
    }
}
