import { HttpModule, HttpService } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { PaymentsService } from '../modules/payments/payments.service';
import { AxiosResponse } from "axios";
import { MakePaymentReq } from '../modules/payments/dto/make-payment.req';

describe('PaymentsService', () => {
  let service: PaymentsService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, ConfigModule],
      providers: [PaymentsService],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('make payment', () => {
    it('should return data when successfully called', async () => {

      const req: MakePaymentReq = {
        referenceId: "xxx",
        amount: 50
      }

      const data: any = {
        paymentId: "xxx",
        paymentStatus: "xxx"
      }

      const response: AxiosResponse = {
        data,
        headers: {},
        config: { url: 'http://localhost:3000/mockUrl' },
        status: 200,
        statusText: 'OK',
      };

      jest.spyOn(httpService, 'post').mockImplementationOnce(() => of(response));

      service.makePayment(req).subscribe(res => {
        expect(res).toEqual(data);
      })
    });
  });
});
