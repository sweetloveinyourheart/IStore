import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Post, Query, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { NewShopVoucherDTO } from './dto/new-shop-voucher.dto';
import { NewVoucherDTO } from './dto/new.dto';
import { ShopVoucher } from './models/shop-voucher.model';
import { Voucher } from './models/voucher.model';
import { VoucherService } from './voucher.service';

@Controller('voucher')
export class VoucherController {
  constructor(private readonly voucherService: VoucherService) { }

  @Get('getAll')
  async getVouchers(
    @Query('cursor', new DefaultValuePipe(0), ParseIntPipe) cursor: number
  ): Promise<Voucher[]> {
    return await this.voucherService.getVouchers(cursor)
  }

  @UseGuards(JwtAuthGuard)
  @Get('user')
  async userGetVouchers(@Request() req): Promise<Voucher[]> {
    return await this.voucherService.getUserVouchers(req.user.username)
  }

  @Get('getVouchers/:username')
  async getUserVouchers(
    @Param('username') username: string
  ): Promise<Voucher[]> {
    return await this.voucherService.getUserVouchers(username)
  }

  @Get('getShopVouchers')
  async getShopVouchers(): Promise<ShopVoucher[]> {
    return await this.voucherService.getShopVouchers()
  }

  @Get('apply/:username')
  @UseGuards(JwtAuthGuard)
  async applyVoucher(@Param('username') username: string) {
    return await this.voucherService.applyVoucher(username)
  }

  @Post('new/user')
  @UseGuards(JwtAuthGuard)
  async newUserVoucher(@Body() voucher: NewVoucherDTO) {
    return await this.voucherService.createVoucher(voucher)
  }

  @Post('new/shop')
  @UseGuards(JwtAuthGuard)
  async newShopVoucher(@Body() shopVoucher: NewShopVoucherDTO) {
    return await this.voucherService.createShopVoucher(shopVoucher)
  }

  @Delete('delete/:id')
  async deleteVoucher(@Param('id') id: string) {
    return await this.voucherService.removeVoucher(id)
  }

  @Delete('shopVoucher/delete/:id')
  async deleteShopVoucher(@Param('id') id: string) {
    return await this.voucherService.removeShopVoucher(id)
  }

}
