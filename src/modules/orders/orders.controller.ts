import { Body, Controller, Get, Param, Post, Delete, ParseUUIDPipe, HttpCode, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ApiResponse } from '@nestjs/swagger/dist/decorators/api-response.decorator';
import { ApiTags } from '@nestjs/swagger/dist/decorators/api-use-tags.decorator';
import { Observable, of } from 'rxjs';
import { CreateOrderReq } from './dto/create-order.req';
import { CreateOrderResp } from './dto/create-order.resp';
import { GetOrderStatusResp } from './dto/get-order-status.resp';
import { GetOrderResp } from './dto/get-order.resp';
import { Order } from './orders.entity';
import { OrdersService } from './orders.service';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
    constructor(private readonly orderService: OrdersService) { }

    @Post()
    @UsePipes(new ValidationPipe({ transform: true }))
    @ApiOperation({ summary: 'Create a new order' })
    @ApiResponse({ status: 201, description: 'The order has been successfully created.' })
    @ApiResponse({ status: 403, description: 'The same request has already been processed.' })
    async create(@Body() req: CreateOrderReq): Promise<CreateOrderResp> {
        return await this.orderService.createOrder(req);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get order by id' })
    async get(@Param('id', ParseUUIDPipe) id: string): Promise<GetOrderResp> {
        return await this.orderService.getOrderById(id);
    }

    @Get(':id/status')
    @ApiOperation({ summary: 'Get order status by id' })
    async getStatus(@Param('id', ParseUUIDPipe) id: string): Promise<GetOrderStatusResp> {
        return await this.orderService.getOrderStatusById(id);
    }

    @Get()
    @ApiOperation({ summary: 'Get all orders' })
    async getAll(): Promise<GetOrderResp[]> {
        return await this.orderService.findAll();
    }

    @Delete(':id')
    @HttpCode(204)
    @ApiOperation({ summary: 'Cancel an order by id' })
    async cancel(@Param('id', ParseUUIDPipe) id: string) {
        return await this.orderService.cancelOrder(id);
    }
}
