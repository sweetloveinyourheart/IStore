import { IsString } from "class-validator"

export class NewCategoryDTO {
    @IsString()
    name: string
}