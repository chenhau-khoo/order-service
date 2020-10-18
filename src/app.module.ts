import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrdersModule } from './modules/orders/orders.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { ScheduleModule } from '@nestjs/schedule';
import { SchedulersModule } from './modules/schedulers/schedulers.module';

@Module({
  imports: [TypeOrmModule.forRoot(),
  ScheduleModule.forRoot(),
    OrdersModule,
    PaymentsModule,
    SchedulersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
