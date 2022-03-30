import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose'
import { lastValueFrom, map } from 'rxjs';
import { UserService } from 'src/user/user.service';
import { NewShopVoucherDTO } from './dto/new-shop-voucher.dto';
import { NewVoucherDTO } from './dto/new.dto';
import { ShopVoucher, ShopVoucherDocument } from './models/shop-voucher.model';
import { Voucher, VoucherDocument } from './models/voucher.model';
import { VoucherGateway } from './voucher.gateway';

@Injectable()
export class VoucherService {
    constructor(
        @InjectModel(Voucher.name) private voucherModel: Model<VoucherDocument>,
        @InjectModel(ShopVoucher.name) private shopVoucherModel: Model<ShopVoucherDocument>,
        private voucherGateway: VoucherGateway,
        private userService: UserService
    ) { }

    public async createVoucher(voucher: NewVoucherDTO): Promise<Voucher> {
        try {
            const user = await this.userService.getUser(voucher.owner)
            if (!user) throw new Error()

            const newVoucher = await this.voucherModel.create({
                ...voucher,
                createAt: new Date()
            })
            return await newVoucher.save()

        } catch (error) {
            throw new BadRequestException({
                message: 'Create failed!'
            })
        }
    }

    public async createShopVoucher(shopVoucher: NewShopVoucherDTO): Promise<ShopVoucher> {
        try {
            const newVoucher = await this.shopVoucherModel.create({
                ...shopVoucher,
                createAt: new Date()
            })
            return await newVoucher.save()

        } catch (error) {
            throw new BadRequestException({
                message: 'Create failed!'
            })
        }
    }

    public async getVouchers(cursor: number): Promise<Voucher[]> {
        try {
            return await this.voucherModel.find({ available: true }).populate('shopVoucher').skip(cursor).limit(20).sort({ createAt: -1 })

        } catch (error) {
            throw new NotFoundException()
        }
    }

    public async getShopVouchers(): Promise<ShopVoucher[]> {
        try {
            return await this.shopVoucherModel.find().sort({ createAt: -1 })

        } catch (error) {
            throw new NotFoundException()
        }
    }

    public async getUserVouchers(username: string): Promise<Voucher[]> {
        try {
            return await this.voucherModel.find({ owner: username, available: true }).populate('shopVoucher').sort({ createAt: -1 })

        } catch (error) {
            throw new NotFoundException()
        }
    }

    public async applyVoucher(username: string) {
        try {
            const user = await this.userService.getUser(username)
            if (!user) throw new Error()

            const vouchers = await this.voucherModel.find({ owner: username, available: true }).populate('shopVoucher')
            this.voucherGateway.server.emit('sendApplyRequest', { vouchers, user })

            return {
                vouchers,
                user
            }

        } catch (error) {
            throw new NotFoundException()
        }
    }

    public async removeVoucher(_id: string): Promise<Voucher> {
        try {
            const voucher = await this.voucherModel.findById(_id)

            await this.voucherModel.findByIdAndUpdate(_id, { 
                count: voucher.count - 1,
                available: voucher.count > 1 ? true : false 
            })

            return voucher

        } catch (error) {
            throw new NotFoundException({
                message: 'Remove failed!'
            })
        }
    }

    public async removeShopVoucher(_id: string): Promise<Voucher> {
        try {
            return await this.shopVoucherModel.findByIdAndDelete(_id)

        } catch (error) {
            throw new NotFoundException({
                message: 'Remove failed!'
            })
        }
    }

}
