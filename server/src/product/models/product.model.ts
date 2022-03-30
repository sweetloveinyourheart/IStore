import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Category } from 'src/category/models/category.model';

export type ProductDocument = Product & Document;

@Schema()
export class Product {
    @Prop()
    image: string

    @Prop()
    name: string
    
    @Prop({ type: Object })
    price: {
        S?: number | undefined,
        M?: number | undefined,
        L?: number | undefined
    }

    @Prop({ default: true })
    status: boolean
    
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Category' })
    category: Category

    @Prop()
    createAt: Date
}

export const ProductSchema = SchemaFactory.createForClass(Product);