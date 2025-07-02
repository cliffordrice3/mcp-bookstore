import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Order } from './order.entity';

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @Column() bookId!: string;
  @Column('int') quantity!: number;
  @Column('int') price!: number;

  @ManyToOne(() => Order, (order) => order.items)
  order!: Order;
}
