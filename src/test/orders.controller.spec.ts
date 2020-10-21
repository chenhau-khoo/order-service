import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { of } from 'rxjs';
import * as request from 'supertest';
import { v4 as uuidv4 } from 'uuid';
import { OrderStatus } from '../modules/orders/const/order-status.enum';
import { OrdersController } from '../modules/orders/orders.controller';
import { Order } from '../modules/orders/orders.entity';
import { OrdersService } from '../modules/orders/orders.service';
import { PaymentStatus } from '../modules/payments/const/payment-status.enum';
import { MakePaymentResp } from '../modules/payments/dto/make-payment.resp';
import { PaymentsService } from '../modules/payments/payments.service';

describe('OrdersController', () => {
  let app: INestApplication;
  let paymentService: PaymentsService;

  let mockOderData: {
    id: "xxx",
    requestId: "xxx",
    status: OrderStatus.CREATED,
  }

  let findOne: jest.Mock;
  let save: jest.Mock;
  let makePayment: jest.Mock;

  const usersRepository = {
    create: jest.fn().mockResolvedValue(mockOderData),
    save: jest.fn().mockReturnValue(Promise.resolve())
  }

  beforeEach(async () => {
    findOne = jest.fn();
    save = jest.fn();
    makePayment = jest.fn();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        OrdersService, {
          provide: getRepositoryToken(Order),
          useValue: {
            findOne,
            save
          }
        },
        {
          provide: PaymentsService,
          useValue: {
            makePayment
          }
        }]
    }).compile();

    // controller = module.get<OrdersController>(OrdersController);
    paymentService = module.get<PaymentsService>(PaymentsService);
    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  describe('when get order by id', () => {
    describe('and id is UUID', () => {
      it('should return http status 200', () => {
        findOne.mockReturnValue(Promise.resolve(new Order()));
        let id = uuidv4();
        return request(app.getHttpServer())
          .get(`/orders/${id}`)
          .expect(200);
      });
    })
    describe('and id is not UUID', () => {
      it('should return http status 400', () => {
        let id = 'xxxxxxx';
        return request(app.getHttpServer())
          .get(`/orders/${id}`)
          .expect(400);
      })
    })
    describe('and id cannot be found in DB', () => {
      it('should return http status 404', () => {
        findOne.mockReturnValue(Promise.resolve(null));
        let id = uuidv4();
        return request(app.getHttpServer())
          .get(`/orders/${id}`)
          .expect(404);
      })
    })
  });

  describe('when creating order', () => {
    describe('and order has already been processed', () => {
      it('should return http status 403 (FORBIDDEN)', () => {
        let requestId = uuidv4();
        const mockOrder: Order = {
          id: uuidv4(),
          amount: 10.99,
          desc: "happy meal",
          requestId: requestId,
          createdOn: new Date(),
          updatedOn: new Date(),
          status: OrderStatus.DELIVERED
        }
        findOne.mockReturnValue(Promise.resolve(mockOrder));
        return request(app.getHttpServer())
          .post('/orders')
          .send({
            "requestId": requestId,
            "amount": 10.99,
            "desc": "happy meal"
          })
          .expect(403)
      })
    })
    describe('and payment is CONFIRMED', () => {
      it('should respond order with CONFIRMED status', () => {
        let requestId = uuidv4();
        const mockSavedOrder: Order = {
          id: uuidv4(),
          amount: 10.99,
          desc: "happy meal",
          requestId: requestId,
          createdOn: new Date(),
          updatedOn: new Date(),
          status: OrderStatus.CREATED
        }
        findOne.mockReturnValue(Promise.resolve(null));
        save.mockReturnValue(Promise.resolve(mockSavedOrder));
        const mockPaymentResp: MakePaymentResp = {
          paymentId: uuidv4(),
          paymentStatus: PaymentStatus.CONFIRMED
        }
        jest.spyOn(paymentService, 'makePayment').mockImplementationOnce(() => of(mockPaymentResp));
        return request(app.getHttpServer())
          .post('/orders')
          .send({
            "requestId": requestId,
            "amount": 10.99,
            "desc": "happy meal"
          })
          .then(res => {
            expect(res.status).toEqual(201);
            const data = <Order>res.body;
            expect(data.status).toEqual(OrderStatus.CONFIRMED);
            expect(data.amount).toEqual(mockSavedOrder.amount);
            expect(data.desc).toEqual(mockSavedOrder.desc);
          });
      })
    })
    describe('and payment is DECLINED', () => {
      it('should respond order with CANCELLED status', () => {
        let requestId = uuidv4();
        const mockSavedOrder: Order = {
          id: uuidv4(),
          amount: 11.99,
          desc: "Mcd chicken set",
          requestId: requestId,
          createdOn: new Date(),
          updatedOn: new Date(),
          status: OrderStatus.CREATED
        }
        findOne.mockReturnValue(Promise.resolve(null));
        save.mockReturnValue(Promise.resolve(mockSavedOrder));
        const mockPaymentResp: MakePaymentResp = {
          paymentId: uuidv4(),
          paymentStatus: PaymentStatus.DECLINED
        }
        jest.spyOn(paymentService, 'makePayment').mockImplementationOnce(() => of(mockPaymentResp));
        return request(app.getHttpServer())
          .post('/orders')
          .send({
            "requestId": requestId,
            "amount": 11.99,
            "desc": "Mcd chicken set"
          })
          .then(res => {
            expect(res.status).toEqual(201);
            const data = <Order>res.body;
            expect(data.status).toEqual(OrderStatus.CANCELLED);
            expect(data.amount).toEqual(mockSavedOrder.amount);
            expect(data.desc).toEqual(mockSavedOrder.desc);
          });
      })
    })
  });


});
