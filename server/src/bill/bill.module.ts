import { Module } from '@nestjs/common';
import { BillService } from './bill.service';
import { BillController } from './bill.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Bill, BillSchema } from './models/bill.model';
import { UserModule } from 'src/user/user.module';
import { VoucherModule } from 'src/voucher/voucher.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Bill.name, schema: BillSchema }]),
    UserModule,
    VoucherModule
  ],
  controllers: [BillController],
  providers: [BillService]
})
export class BillModule {}
