import { Module } from '@nestjs/common';
import { VoucherService } from './voucher.service';
import { VoucherController } from './voucher.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Voucher, VoucherSchema } from './models/voucher.model';
import { HttpModule } from '@nestjs/axios';
import { VoucherGateway } from './voucher.gateway';
import { UserModule } from 'src/user/user.module';
import { ShopVoucher, ShopVoucherSchema } from './models/shop-voucher.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Voucher.name, schema: VoucherSchema },
      { name: ShopVoucher.name, schema: ShopVoucherSchema }
    ]),
    HttpModule,
    UserModule
  ],
  controllers: [VoucherController],
  providers: [VoucherService, VoucherGateway],
  exports: [VoucherService]
})

export class VoucherModule {}