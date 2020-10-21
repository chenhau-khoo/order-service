import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { OrderStatus } from 'src/modules/orders/const/order-status.enum';
import { Order } from '../orders/orders.entity';
import { OrdersService } from '../orders/orders.service';

@Injectable()
export class SchedulersService {

    private readonly logger = new Logger(SchedulersService.name);

    constructor(
        private readonly scheduler: SchedulerRegistry,
        private readonly orderService: OrdersService,
    ) { }

    @Cron(CronExpression.EVERY_30_SECONDS)
    async cronMarkOrderStatusAsDelivered() {
        this.logger.debug('Called every 30 seconds');
        const orders: Order[] = await this.orderService.findByStatus(OrderStatus.CONFIRMED);
        orders.forEach(async val => {
            this.orderService.deliverOrder(val.id);
            this.logger.log(`OrderId=${val.id} status marked as ${OrderStatus.DELIVERED}.`);
        });
    }

}
