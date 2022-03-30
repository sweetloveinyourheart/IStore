import { IsEnum, IsNumber, IsObject, IsString } from "class-validator"
import { VoucherType } from "../interfaces/voucher"

export class NewVoucherDTO {
    @IsString()
    owner: string

    @IsString()
    shopVoucher: string

    @IsNumber()
    count: number
}