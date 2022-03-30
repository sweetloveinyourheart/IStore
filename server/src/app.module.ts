import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { VoucherModule } from './voucher/voucher.module';
import { BillModule } from './bill/bill.module';
import { AuthModule } from './auth/auth.module';
import { HttpModule } from '@nestjs/axios';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'images'),
      serveRoot: "/images",
      serveStaticOptions: {
        index: false,
      }
    }),
    MongooseModule.forRoot(process.env.MONGO_URL),
    CategoryModule,
    ProductModule,
    VoucherModule,
    BillModule,
    AuthModule,
    HttpModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
