import { CartService } from './cart.service';
export declare class CartController {
    private readonly cart;
    constructor(cart: CartService);
    view(req: any): import("./cart.service").Cart;
    add(req: any, bookId: string, qty?: number): import("./cart.service").Cart;
    remove(req: any, bookId: string): import("./cart.service").Cart;
}
