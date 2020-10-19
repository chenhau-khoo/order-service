import { BadRequestException, Injectable, NotFoundException, InternalServerErrorException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentStatus } from 'src/shared/payment-status.enum';
import { Repository } from 'typeorm';
import { OrderStatus } from '../../shared/order-status.enum';
import { MakePaymentReq } from '../payments/dto/make-payment.req';
import { PaymentsService } from '../payments/payments.service';
import { CreateOrderReq } from './dto/create-order.req';
import { CreateOrderResp } from './dto/create-order.resp';
import { GetOrderResp } from './dto/get-order.resp';
import { Order } from './orders.entity';

@Injectable()
export class OrdersService {
    constructor(@InjectRepository(Order) private orderRepository: Repository<Order>,
        private paymentService: PaymentsService,
    ) { }

    async createOrder(req: CreateOrderReq): Promise<CreateOrderResp> {
        let order = await this.initialOrder(req.requestId, req.desc, req.amount);
        order = await this.payOrder(order);
        let resp = new CreateOrderResp;
        resp.id = order.id;
        resp.status = order.status;
        return resp;
    }

    async initialOrder(requestId: string, desc: string, amount: number): Promise<Order> {
        if (await this.orderRepository.findOne({ requestId })) {
            throw new ForbiddenException(`The requestId: ${requestId} already exists.`);
        }
        const order = new Order();
        order.requestId = requestId;
        order.desc = desc;
        order.amount = amount;
        order.status = OrderStatus.CREATED;
        return await this.orderRepository.save(order);
    }

    async getOrder(id: string): Promise<GetOrderResp> {
        if (!id) {
            throw new BadRequestException('Id is missing');
        }
        const order: Order = await this.orderRepository.findOne(id);
        if (!order) {
            throw new NotFoundException(`Invalid orderId=${id}`);
        }
        let resp = new GetOrderResp;
        resp.id = order.id;
        resp.status = order.status;
        resp.createdOn = order.createdOn;
        resp.updatedOn = order.updatedOn;
        return resp;
    }

    private async payOrder(order: Order): Promise<Order> {
        let makePaymentReq = new MakePaymentReq();
        makePaymentReq.amount = order.amount;
        makePaymentReq.referenceId = order.id;
        const makePaymentResp = await this.paymentService.makePayment(makePaymentReq)
            .toPromise()
            .catch(e => {
                console.error(e.response.data);
                throw new InternalServerErrorException('Failed to make payment');
            });
        if (makePaymentResp.paymentStatus === PaymentStatus.CONFIRMED) {
            order.status = OrderStatus.CONFIRMED;
        } else if (makePaymentResp.paymentStatus === PaymentStatus.DECLINED) {
            order.status = OrderStatus.CANCELLED;
        }
        return await this.orderRepository.save(order);
    }

    async cancelOrder(id: string) {
        if (!id) {
            throw new BadRequestException('id is missing');
        }
        const order: Order = await this.orderRepository.findOne(id);
        if (!order) {
            throw new NotFoundException(`Invalid orderId=${id}`);
        }
        if (order.status !== OrderStatus.CREATED && order.status !== OrderStatus.CONFIRMED) {
            throw new BadRequestException(`Action cannot be completed, current order status=${order.status}`);
        }
        order.status = OrderStatus.CANCELLED;
        await this.orderRepository.save(order);
    }

    async findByStatus(status: OrderStatus): Promise<Order[]> {
        return this.orderRepository.find({ status });
    }

    //TODO: Pagination
    async findAll(): Promise<GetOrderResp[]> {
        const orders: Order[] = await this.orderRepository
            .createQueryBuilder('order')
            .orderBy('order.updatedOn', 'DESC')
            .getMany();
        let resp: GetOrderResp[] = [];
        orders.forEach(o => {
            let orderResp = new GetOrderResp();
            orderResp.id = o.id;
            orderResp.desc = o.desc;
            orderResp.status = o.status;
            orderResp.amount = o.amount;
            orderResp.updatedOn = o.updatedOn;
            resp.push(orderResp);
        })
        return resp;
    }

    async deliverOrder(id: string) {
        if (!id) {
            throw new BadRequestException('id is missing');
        }
        const order: Order = await this.orderRepository.findOne(id);
        if (!order) {
            throw new NotFoundException();
        }
        if (order.status !== OrderStatus.CONFIRMED) {
            throw new BadRequestException(`Action cannot be completed, current order status=${order.status}`);
        }
        order.status = OrderStatus.DELIVERED;
        await this.orderRepository.save(order);
    }
}
