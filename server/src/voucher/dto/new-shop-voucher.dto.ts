import { IsNumber, IsObject, IsString } from "class-validator"

export class NewShopVoucherDTO {
    @IsString()
    label: string

    @IsNumber()
    value: number

    @IsObject()
    limit: {
        min: number
        max: number
    }
}