import { Body, Controller, DefaultValuePipe, Get, Param, ParseEnumPipe, ParseIntPipe, Post, Query, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { BillService, TimeStampEnum } from './bill.service';
import { NewBillDTO } from './dto/new.dto';
import { Bill } from './models/bill.model';

@Controller('bill')
export class BillController {
  constructor(private readonly billService: BillService) { }

  @Get('getByCode/:code')
  async getBillByCode(@Param('code') code: string): Promise<Bill> {
    return await this.billService.getBillByCode(code)
  }

  @Get('getByTimestamp')
  async getBillsByTimestamp(
    @Query('timestamp', new ParseEnumPipe(TimeStampEnum)) timestamp: TimeStampEnum,
    @Query('cursor', new DefaultValuePipe(0), ParseIntPipe) cursor: number
  ): Promise<Bill[]> {
    return await this.billService.getBillsByTimeStamp(cursor, timestamp)
  }

  @Get('getAll')
  async getShopBills(@Query('cursor', new DefaultValuePipe(0), ParseIntPipe) cursor: number): Promise<Bill[]> {
    return await this.billService.getShopBills(cursor)
  }

  @UseGuards(JwtAuthGuard)
  @Get('user')
  async getUserBills(@Request() req): Promise<Bill[]> {
    return await this.billService.getUserBills(req.user.username)
  }

  @Get('getOrderStatistics')
  async getOrderStatistics() {
    return await this.billService.getOrderStatistics()
  }

  @Post('new')
  async createBill(@Body() bill: NewBillDTO) {
    return await this.billService.createBill(bill)
  }

}
