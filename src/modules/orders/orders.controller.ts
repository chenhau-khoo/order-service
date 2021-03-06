import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ApiResponse } from '@nestjs/swagger/dist/decorators/api-response.decorator';
import { ApiTags } from '@nestjs/swagger/dist/decorators/api-use-tags.decorator';
import { CreateOrderReq } from './dto/create-order.req';
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
    async create(@Body() req: CreateOrderReq): Promise<Order> {
        return await this.orderService.createOrder(req);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get order by id' })
    async get(@Param('id', ParseUUIDPipe) id: string): Promise<Order> {
        return await this.orderService.getOrderById(id);
    }

    @Get()
    @ApiOperation({ summary: 'Get all orders' })
    async getAll(): Promise<Order[]> {
        return await this.orderService.findAll();
    }

    @Patch(':id/cancel')
    @ApiOperation({ summary: 'Cancel an order by id' })
    async cancel(@Param('id', ParseUUIDPipe) id: string): Promise<Order> {
        return await this.orderService.cancelOrder(id);
    }
}
