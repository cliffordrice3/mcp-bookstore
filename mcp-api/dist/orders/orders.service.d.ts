import { Repository } from 'typeorm';
import { Order } from '../database/entities/order.entity';
import { OrderItem } from '../database/entities/order-item.entity';
import { Cart } from '../cart/cart.service';
import { Book } from '../database/entities/book.entity';
export declare class OrdersService {
    private readonly orderRepo;
    private readonly itemRepo;
    private readonly bookRepo;
    constructor(orderRepo: Repository<Order>, itemRepo: Repository<OrderItem>, bookRepo: Repository<Book>);
    place(userId: string, cart: Cart): Promise<Order>;
    paginate(userId: string, page?: number, size?: number): Promise<{
        page: number;
        size: number;
        total: number;
        data: Order[];
    }>;
    findOne(userId: string, id: string): Promise<Order>;
}
