import { Module } from '@nestjs/common';
import { OrdersModule } from '../orders/orders.module';
import { SchedulersService } from './schedulers.service';

@Module({
  imports: [OrdersModule],
  providers: [SchedulersService]
})
export class SchedulersModule { }
