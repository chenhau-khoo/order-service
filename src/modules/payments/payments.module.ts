import { HttpModule, Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Module({
  imports: [HttpModule.register({
    timeout: 5000
  })],
  providers: [PaymentsService],
  controllers: [],
  exports: [PaymentsService]
})
export class PaymentsModule { }
