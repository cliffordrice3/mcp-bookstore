export interface CartItem {
    bookId: string;
    quantity: number;
}
export interface Cart {
    items: CartItem[];
}
export declare class CartService {
    private carts;
    get(userId: string): Cart;
    add(userId: string, bookId: string, qty?: number): Cart;
    remove(userId: string, bookId: string): Cart;
    clear(userId: string): void;
}
