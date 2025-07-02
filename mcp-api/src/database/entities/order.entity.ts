import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { OrderItem } from './order-item.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @Column() userId!: string;
  @CreateDateColumn() createdAt!: Date;

  @OneToMany(() => OrderItem, (oi) => oi.order, { cascade: true, eager: true })
  items!: OrderItem[];
}
