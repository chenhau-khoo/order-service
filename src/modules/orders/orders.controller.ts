import { Body, Controller, Get, Param, Post, Delete, ParseUUIDPipe, HttpCode } from '@nestjs/common';
import { CreateOrderReq } from './dto/create-order.req';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
    constructor(private readonly orderService: OrdersService) { }

    @Post()
    async create(@Body() req: CreateOrderReq) {
        return this.orderService.createOrder(req);
    }

    @Get(':id')
    async getById() {

    }

    @Get()
    async getAll() {

    }

    @Post(':id/cancel')
    @HttpCode(200)
    async cancel(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
        return await this.orderService.cancelOrder(id);
    }
}
