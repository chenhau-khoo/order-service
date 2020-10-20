import { IsString, IsNumber, IsNotEmpty, IsUUID, Max } from 'class-validator';

export class CreateOrderReq {

    @IsNotEmpty()
    @IsUUID()
    readonly requestId: string;

    @IsNumber()
    @IsNotEmpty()
    @Max(9999)
    readonly amount: number;

    @IsString()
    @IsNotEmpty()
    readonly desc: string;
}