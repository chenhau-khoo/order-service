import { IsString, IsNumber, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateOrderReq {

    @IsNotEmpty()
    @IsUUID()
    readonly requestId: string;

    @IsNumber()
    @IsNotEmpty()
    readonly amount: number;

    @IsString()
    @IsNotEmpty()
    readonly desc: string;
}