import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';
import { OrderStatus } from '../../shared/order-status.enum';

@Entity()
export class Order {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({
        nullable: false,
        type: "enum",
        enum: OrderStatus
    })
    status: OrderStatus;

    @Column()
    amount: number;

    @Column({ length: 150 })
    desc: string;

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