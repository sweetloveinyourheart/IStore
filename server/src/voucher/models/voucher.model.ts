import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { ShopVoucher } from './shop-voucher.model';

export type VoucherDocument = Voucher & Document;

@Schema()
export class Voucher {
    @Prop()
    owner: string

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'ShopVoucher' })
    shopVoucher: ShopVoucher

    @Prop()
    count: number

    @Prop({ default: true })
    available: boolean

    @Prop()
    createAt: Date
}

export const VoucherSchema = SchemaFactory.createForClass(Voucher);