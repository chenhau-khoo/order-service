import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';
import { OrderStatus } from './enum/orderStatus';

@Entity()
export class Order extends BaseEntity {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({
        type: "enum",
        enum: OrderStatus
    })
    orderStatus: OrderStatus;

    @Column({
        nullable: false,
        default: () => 'CURRENT_TIMESTAMP',
        type: 'timestamp',
    })
    createdOn: Date;

    @Column({
        nullable: false,
        default: () => 'CURRENT_TIMESTAMP',
        type: 'timestamp',
    })
    updatedOn: Date;


}