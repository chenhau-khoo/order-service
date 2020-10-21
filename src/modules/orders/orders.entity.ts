import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, Index } from 'typeorm';
import { OrderStatus } from '../shared/order-status.enum';

@Entity()
@Index(["status"])
@Index(["requestId"], { unique: true })
export class Order {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ nullable: false })
    requestId: string;

    @Column({
        nullable: false,
        type: "enum",
        enum: OrderStatus
    })
    status: OrderStatus;

    @Column({ type: 'decimal', precision: 6, scale: 2 })
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
        onUpdate: "CURRENT_TIMESTAMP",
        type: 'timestamp',
    })
    updatedOn: Date;


}