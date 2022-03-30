import { IsNumber, IsOptional, IsString } from "class-validator";

export class NewUser {
    @IsString()
    username: string

    @IsString()
    name: string

    @IsString()
    password: string

    @IsOptional()
    @IsNumber()
    age: number

}