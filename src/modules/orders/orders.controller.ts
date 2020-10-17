import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateOrderReq } from './dto/create-order.req';
import { CreateOrderResp } from './dto/create-order.resp';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
    constructor(private orderService: OrdersService) { }

    @Post()
    create(@Body() req: CreateOrderReq): Promise<CreateOrderResp> {
        return this.orderService.createOrder(req);
    }

    @Get(':id')
    async get(@Param('id') id: string) {

    }
}
