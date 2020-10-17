import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { exception } from 'console';
import { response } from 'express';
import { Repository } from 'typeorm';
import { OrderStatus } from '../../shared/order-status.enum';
import { CreateOrderReq } from './dto/create-order.req';
import { CreateOrderResp } from './dto/create-order.resp';
import { GetOrderResp } from './dto/get-order.resp';
import { Order } from './orders.entity';

@Injectable()
export class OrdersService {
    constructor(@InjectRepository(Order) private orderRepository: Repository<Order>) { }

    async createOrder(req: CreateOrderReq): Promise<CreateOrderResp> {
        let order = new Order();
        order.status = OrderStatus.CREATED;
        order.desc = req.desc;
        order.amount = req.amount;
        const newOrder: Order = await this.orderRepository.save(order);
        let resp = new CreateOrderResp;
        resp.id = newOrder.id;
        resp.status = newOrder.status;
        return resp;
    }

    async getOrder(id: string): Promise<GetOrderResp> {
        if (!id) {
            throw new BadRequestException('id is missing');
        }
        const order: Order = await this.orderRepository.findOne(id);
        if (!order) {
            throw new NotFoundException();
        }
        let resp = new GetOrderResp;
        resp.id = order.id;
        resp.status = order.status;
        return resp;
    }
}
