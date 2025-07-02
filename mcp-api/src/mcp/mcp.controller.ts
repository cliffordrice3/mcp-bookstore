import { Controller, Post, Body, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { BooksService } from '../books/books.service';
import { AuthorsService } from '../authors/authors.service';
import { CartService } from '../cart/cart.service';
import { OrdersService } from '../orders/orders.service';

type IdParam = { id: string };

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
  params: Omit<BookIdQtyParams, 'qty'> & { qty?: never };
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

type Params =
  | ListInventoryParams
  | BookDetailsParams
  | AuthorDetailsParams
  | AddToCartParams
  | RemoveFromCartParams
  | ViewCartParams
  | PlaceOrderParams
  | ListOrdersParams
  | OrderDetailsParams;

type JsonRpcReq = Params & {
  jsonrpc: '2.0';
  id: string | number;
};

@Controller('mcp')
@UseGuards(JwtAuthGuard)
export class McpController {
  constructor(
    private books: BooksService,
    private authors: AuthorsService,
    private cart: CartService,
    private orders: OrdersService,
  ) {}

  @Post()
  async rpc(@Body() body: JsonRpcReq, @Request() req) {
    const { method, params } = body;
    const uid = req.user.userId;

    try {
      let result: unknown;
      switch (method) {
        case 'listInventory':
          result = await this.books.paginate(
            params.page ?? 1,
            params.size ?? 20,
          );
          break;
        case 'bookDetails':
          result = await this.books.findOne(params.id);
          break;
        case 'authorDetails':
          result = await this.authors.findOne(params.id);
          break;
        case 'addToCart':
          result = this.cart.add(uid, params.bookId, params.qty ?? 1);
          break;
        case 'removeFromCart':
          result = this.cart.remove(uid, params.bookId);
          break;
        case 'viewCart':
          result = this.cart.get(uid);
          break;
        case 'placeOrder':
          result = await this.orders.place(uid, this.cart.get(uid));
          this.cart.clear(uid);
          break;
        case 'listOrders':
          result = await this.orders.paginate(
            uid,
            params.page ?? 1,
            params.size ?? 20,
          );
          break;
        case 'orderDetails':
          result = await this.orders.findOne(uid, params.id);
          break;
        default:
          throw new Error('Method not found', { cause: -32601 });
      }
      return { jsonrpc: '2.0', id: body.id, result };
    } catch (e) {
      return {
        jsonrpc: '2.0',
        id: body.id,
        error: { code: e.cause ?? -32603, message: e.message },
      };
    }
  }
}
