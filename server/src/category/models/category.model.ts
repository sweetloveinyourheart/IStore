import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type CategoryDocument = Category & Document;

@Schema()
export class Category {
    @Prop()
    name: string;

    @Prop()
    image: string
}

export const CategorySchema = SchemaFactory.createForClass(Category);