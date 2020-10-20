import { Body, Controller, Get, Param, Post, Delete, ParseUUIDPipe, HttpCode, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateOrderReq } from './dto/create-order.req';
import { CreateOrderResp } from './dto/create-order.resp';
import { GetOrderStatusResp } from './dto/get-order-status.resp';
import { GetOrderResp } from './dto/get-order.resp';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
    constructor(private readonly orderService: OrdersService) { }

    @Post()
    @UsePipes(new ValidationPipe({ transform: true }))
    async create(@Body() req: CreateOrderReq): Promise<CreateOrderResp> {
        return await this.orderService.createOrder(req);
    }

    @Get(':id')
    async get(@Param('id', ParseUUIDPipe) id: string): Promise<GetOrderResp> {
        return await this.orderService.getOrderById(id);
    }

    @Get(':id/status')
    async getStatus(@Param('id', ParseUUIDPipe) id: string): Promise<GetOrderStatusResp> {
        return await this.orderService.getOrderStatusById(id);
    }

    @Get()
    async getAll(): Promise<GetOrderResp[]> {
        return await this.orderService.findAll();
    }

    @Delete(':id')
    @HttpCode(204)
    async cancel(@Param('id', ParseUUIDPipe) id: string) {
        return await this.orderService.cancelOrder(id);
    }
}
