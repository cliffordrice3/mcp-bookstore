import { OrderItem } from './order-item.entity';
export declare class Order {
    id: string;
    userId: string;
    createdAt: Date;
    items: OrderItem[];
}
