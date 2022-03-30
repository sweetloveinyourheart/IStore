import { IsArray, IsNumber, IsObject, IsOptional } from "class-validator"
import { Product } from "src/product/models/product.model"

export class NewBillDTO {
    @IsObject()
    customer: {
        name: string
        type: string
        username?: string
    }

    @IsArray()
    items: {
        product: Product
        size: string
        quantity: number
    }[]

    @IsOptional()
    voucher?: string

    @IsOptional()
    preferential?: number

    @IsNumber()
    totalPrice: number
}