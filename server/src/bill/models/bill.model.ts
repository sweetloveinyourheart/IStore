import { Product } from "src/product/models/product.model"
import mongoose, { Document } from 'mongoose';
import { Voucher } from "src/voucher/models/voucher.model"
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type BillDocument = Document & Bill

@Schema()
export class Bill {
    @Prop()
    code: string

    @Prop({ type: Object })
    customer: {
        name: string
        type: string
        username?: string
    }

    @Prop({ type: Array })
    items: {
        product: Product
        quantity: number
    }[]

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Voucher" })
    voucher?: Voucher

    @Prop()
    preferential?: number
    
    @Prop()
    totalPrice: number

    @Prop()
    createAt: Date
}

export const BillSchema = SchemaFactory.createForClass(Bill)