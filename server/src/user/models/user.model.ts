import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose'

export type UserDocument = User & Document

@Schema()
export class User {
    @Prop({ unique: true })
    username: string

    @Prop()
    password: string

    @Prop({ default: 'customer' })
    role: string

    @Prop()
    name: string

    @Prop()
    age: number

    @Prop()
    createAt: Date
}

export const UserSchema = SchemaFactory.createForClass(User)