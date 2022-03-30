import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { VoucherType } from '../interfaces/voucher';

export type ShopVoucherDocument = ShopVoucher & Document;

@Schema()
export class ShopVoucher {
    @Prop()
    label: string

    @Prop({ enum: VoucherType, default: VoucherType.Discount })
    type: VoucherType

    @Prop()
    value: number

    @Prop({ type: Object })
    limit: {
        min: number
        max: number
    }

    @Prop()
    createAt: Date
}

export const ShopVoucherSchema = SchemaFactory.createForClass(ShopVoucher);