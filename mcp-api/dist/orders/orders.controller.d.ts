import { OrdersService } from './orders.service';
import { CartService } from '../cart/cart.service';
import { PaginateDto } from '../common/dto/paginate.dto';
export declare class OrdersController {
    private orders;
    private cart;
    constructor(orders: OrdersService, cart: CartService);
    place(req: any): Promise<import("../database/entities/order.entity").Order>;
    list(req: any, { page, size }: PaginateDto): Promise<{
        page: number;
        size: number;
        total: number;
        data: import("../database/entities/order.entity").Order[];
    }>;
    detail(req: any, id: string): Promise<import("../database/entities/order.entity").Order>;
}
