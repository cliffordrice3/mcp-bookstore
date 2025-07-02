import { Order } from './order.entity';
export declare class OrderItem {
    id: string;
    bookId: string;
    quantity: number;
    price: number;
    order: Order;
}
