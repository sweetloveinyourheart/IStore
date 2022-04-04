import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose';
import { Bill, BillDocument } from './models/bill.model';
import { NewBillDTO } from './dto/new.dto';
import { UserService } from 'src/user/user.service';
import { VoucherService } from 'src/voucher/voucher.service';

export enum TimeStampEnum {
    day = 'day',
    week = "week",
    month = "month",
    year = "year"
}

@Injectable()
export class BillService {
    constructor(
        @InjectModel(Bill.name) private billModel: Model<BillDocument>,
        private userService: UserService,
        private voucherService: VoucherService
    ) { }

    private getTimeStamp(step: TimeStampEnum) {
        let d = new Date()
        switch (step) {
            case "day":
                return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
            case "week":
                return new Date(d.getFullYear(), d.getMonth(), d.getDate() - 7)
            case "month":
                d.setDate(1);

                return d
            case "year":
                d.setFullYear(d.getFullYear() - 1);
                d.setMonth(0)
                d.setDate(1);
                return d

            default:
                return new Date()
        }
    }

    public async createBill(bill: NewBillDTO): Promise<Bill> {
        try {
            //Generate code
            function makeOrderCode(length) {
                var result = '';
                var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                var charactersLength = characters.length;
                for (var i = 0; i < length; i++) {
                    result += characters.charAt(Math.floor(Math.random() * charactersLength));
                }
                return result;
            }
            const code = makeOrderCode(8)

            const newBill = await this.billModel.create({
                ...bill,
                code,
                createAt: new Date()
            })

            // Delete applied voucher
            if (bill.voucher) {
                await this.voucherService.removeVoucher(bill.voucher)
            }

            return await newBill.save()

        } catch (error) {
            throw new BadRequestException({
                message: 'Create bill failed!'
            })
        }
    }

    public async getShopBills(cursor: number): Promise<Bill[]> {
        try {
            return await this.billModel.find().skip(cursor).limit(10).sort({ createAt: -1 })
        } catch (error) {
            throw new NotFoundException()
        }
    }

    public async getUserBills(username: string): Promise<Bill[]> {
        try {
            return await this.billModel.find({ 'customer.username': username }).sort({ createAt: -1 })
        } catch (error) {
            throw new NotFoundException()
        }
    }

    public async getBillByCode(code: string): Promise<Bill> {
        try {
            return await this.billModel.findOne({ code }).populate({
                path: 'voucher',
                populate: {
                    path: 'shopVoucher'
                }
            })
        } catch (error) {
            throw new NotFoundException()
        }
    }

    public async getBillsByTimeStamp(cursor: number, timestamp: TimeStampEnum): Promise<Bill[]> {
        try {
            return await this.billModel
                .find({ createAt: { $gte: this.getTimeStamp(timestamp) } })
                .skip(cursor)
                .limit(20)
                .sort({ createAt: -1 })
        } catch (error) {
            throw new NotFoundException()
        }
    }

    public async getOrderStatistics() {
        try {
            const result = await this.billModel.aggregate([{
                $facet: {
                    day: [
                        {
                            $match: {
                                "createAt": {
                                    $gte: this.getTimeStamp(TimeStampEnum.day)
                                }
                            }
                        },
                        {
                            $group: {
                                _id: "day",
                                value: { $sum: "$totalPrice" }
                            }
                        }
                    ],
                    week: [
                        {
                            $match: {
                                "createAt": {
                                    $gte: this.getTimeStamp(TimeStampEnum.week)
                                }
                            }
                        },
                        {
                            $group: {
                                _id: {
                                    week: { $week: "$createAt" }
                                },
                                value: { $sum: "$totalPrice" }
                            }
                        }
                    ],
                    month: [
                        {
                            $match: {
                                "createAt": {
                                    $gte: this.getTimeStamp(TimeStampEnum.year)
                                }
                            }
                        },
                        {
                            $group: {
                                _id: {
                                    month: { $month: "$createAt" }
                                },
                                value: { $sum: "$totalPrice" },
                            }
                        },
                    ],
                    year: [
                        {
                            $match: {
                                "createAt": {
                                    $gte: this.getTimeStamp(TimeStampEnum.year)
                                }
                            }
                        },
                        {
                            $group: {
                                _id: {
                                    year: { $year: "$createAt" }
                                },
                                value: { $sum: "$totalPrice" }
                            }
                        },
                    ],
                    all: [
                        {
                            $group: {
                                _id: "all",
                                value: { $sum: "$totalPrice" }
                            }
                        }
                    ]
                }
            }])

            return result[0]
        } catch (error) {
            throw new NotFoundException()
        }
    }

}
