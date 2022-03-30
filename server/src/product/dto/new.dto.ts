import { Transform } from "class-transformer"
import { IsJSON, IsString } from "class-validator"

export class NewProductDTO {
    @IsString()
    name: string

    @Transform(({ value }) => JSON.parse(value))
    price: string
    
    @IsString()
    category: string
}