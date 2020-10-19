import { HttpModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PaymentsService } from './payments.service';

@Module({
  imports: [HttpModule.register({ timeout: 5000 }),
    ConfigModule],
  providers: [PaymentsService],
  controllers: [],
  exports: [PaymentsService]
})
export class PaymentsModule { }
