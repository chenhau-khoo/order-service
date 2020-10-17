import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateOrderReq {

    @IsNumber()
    @IsNotEmpty()
    readonly amount: number;

    @IsString()
    @IsNotEmpty()
    readonly desc: string;
}