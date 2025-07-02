import { BooksService } from '../books/books.service';
import { AuthorsService } from '../authors/authors.service';
import { CartService } from '../cart/cart.service';
import { OrdersService } from '../orders/orders.service';
type IdParam = {
    id: string;
};
type PageSizeParams = {
    page?: number;
    size?: number;
};
type BookIdQtyParams = {
    bookId: string;
    qty?: number;
};
type EmptyParams = Record<string, never>;
type ListInventoryParams = {
    method: 'listInventory';
    params: PageSizeParams;
};
type BookDetailsParams = {
    method: 'bookDetails';
    params: IdParam;
};
type AuthorDetailsParams = {
    method: 'authorDetails';
    params: IdParam;
};
type AddToCartParams = {
    method: 'addToCart';
    params: BookIdQtyParams;
};
type RemoveFromCartParams = {
    method: 'removeFromCart';
    params: Omit<BookIdQtyParams, 'qty'> & {
        qty?: never;
    };
};
type ViewCartParams = {
    method: 'viewCart';
    params: EmptyParams;
};
type PlaceOrderParams = {
    method: 'placeOrder';
    params: EmptyParams;
};
type ListOrdersParams = {
    method: 'listOrders';
    params: PageSizeParams;
};
type OrderDetailsParams = {
    method: 'orderDetails';
    params: IdParam;
};
type Params = ListInventoryParams | BookDetailsParams | AuthorDetailsParams | AddToCartParams | RemoveFromCartParams | ViewCartParams | PlaceOrderParams | ListOrdersParams | OrderDetailsParams;
type JsonRpcReq = Params & {
    jsonrpc: '2.0';
    id: string | number;
};
export declare class McpController {
    private books;
    private authors;
    private cart;
    private orders;
    constructor(books: BooksService, authors: AuthorsService, cart: CartService, orders: OrdersService);
    rpc(body: JsonRpcReq, req: any): Promise<{
        jsonrpc: string;
        id: string | number;
        result: unknown;
        error?: undefined;
    } | {
        jsonrpc: string;
        id: string | number;
        error: {
            code: any;
            message: any;
        };
        result?: undefined;
    }>;
}
export {};
