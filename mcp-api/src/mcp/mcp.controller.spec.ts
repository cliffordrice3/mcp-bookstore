import { Test } from '@nestjs/testing';
import { McpController } from './mcp.controller';
import { BooksService } from '../books/books.service';
import { AuthorsService } from '../authors/authors.service';
import { CartService } from '../cart/cart.service';
import { OrdersService } from '../orders/orders.service';

const createMock = <T extends object>() => ({}) as jest.Mocked<T>;

describe('McpController', () => {
  let controller: McpController;
  let books: jest.Mocked<BooksService>;
  let authors: jest.Mocked<AuthorsService>;
  let cart: jest.Mocked<CartService>;
  let orders: jest.Mocked<OrdersService>;

  beforeEach(async () => {
    books = { paginate: jest.fn(), findOne: jest.fn() } as any;
    authors = { findOne: jest.fn() } as any;
    cart = {
      add: jest.fn(),
      remove: jest.fn(),
      get: jest.fn(),
      clear: jest.fn(),
    } as any;
    orders = {
      place: jest.fn(),
      paginate: jest.fn(),
      findOne: jest.fn(),
    } as any;

    const module = await Test.createTestingModule({
      controllers: [McpController],
      providers: [
        { provide: BooksService, useValue: books },
        { provide: AuthorsService, useValue: authors },
        { provide: CartService, useValue: cart },
        { provide: OrdersService, useValue: orders },
      ],
    }).compile();
    controller = module.get(McpController);
  });

  const req = { user: { userId: 'u1' } } as any;

  it('handles listInventory', async () => {
    books.paginate.mockResolvedValueOnce('data' as any);
    const res = await controller.rpc(
      {
        jsonrpc: '2.0',
        id: 1,
        method: 'listInventory',
        params: { page: 2, size: 5 },
      } as any,
      req,
    );
    expect(res.result).toBe('data');
    expect(books.paginate).toHaveBeenCalledWith(2, 5);
  });

  it('handles addToCart', async () => {
    cart.add.mockReturnValueOnce({ items: [] } as any);
    const res = await controller.rpc(
      {
        jsonrpc: '2.0',
        id: 1,
        method: 'addToCart',
        params: { bookId: 'b1', qty: 2 },
      } as any,
      req,
    );
    expect(cart.add).toHaveBeenCalledWith('u1', 'b1', 2);
    expect(res.result).toEqual({ items: [] });
  });

  it('handles removeFromCart and viewCart', async () => {
    cart.remove.mockReturnValueOnce({ items: [] } as any);
    let res = await controller.rpc(
      {
        jsonrpc: '2.0',
        id: 1,
        method: 'removeFromCart',
        params: { bookId: 'b1' },
      } as any,
      req,
    );
    expect(cart.remove).toHaveBeenCalledWith('u1', 'b1');
    expect(res.result).toEqual({ items: [] });

    cart.get.mockReturnValueOnce({ items: [] } as any);
    res = await controller.rpc(
      { jsonrpc: '2.0', id: 1, method: 'viewCart', params: {} } as any,
      req,
    );
    expect(cart.get).toHaveBeenCalledWith('u1');
    expect(res.result).toEqual({ items: [] });
  });

  it('handles placeOrder and listing', async () => {
    cart.get.mockReturnValueOnce({ items: [] } as any);
    orders.place.mockResolvedValueOnce('o' as any);
    let res = await controller.rpc(
      { jsonrpc: '2.0', id: 1, method: 'placeOrder', params: {} } as any,
      req,
    );
    expect(orders.place).toHaveBeenCalled();
    expect(cart.clear).toHaveBeenCalledWith('u1');
    expect(res.result).toBe('o');

    orders.paginate.mockResolvedValueOnce('list' as any);
    res = await controller.rpc(
      {
        jsonrpc: '2.0',
        id: 2,
        method: 'listOrders',
        params: { page: 1, size: 3 },
      } as any,
      req,
    );
    expect(orders.paginate).toHaveBeenCalledWith('u1', 1, 3);
    expect(res.result).toBe('list');
  });

  it('handles order and book/author details', async () => {
    orders.findOne.mockResolvedValueOnce('order' as any);
    let res = await controller.rpc(
      {
        jsonrpc: '2.0',
        id: 1,
        method: 'orderDetails',
        params: { id: 'o1' },
      } as any,
      req,
    );
    expect(orders.findOne).toHaveBeenCalledWith('u1', 'o1');
    expect(res.result).toBe('order');

    books.findOne.mockResolvedValueOnce('book' as any);
    res = await controller.rpc(
      {
        jsonrpc: '2.0',
        id: 2,
        method: 'bookDetails',
        params: { id: 'b1' },
      } as any,
      req,
    );
    expect(books.findOne).toHaveBeenCalledWith('b1');
    expect(res.result).toBe('book');

    authors.findOne.mockResolvedValueOnce('author' as any);
    res = await controller.rpc(
      {
        jsonrpc: '2.0',
        id: 3,
        method: 'authorDetails',
        params: { id: 'a1' },
      } as any,
      req,
    );
    expect(authors.findOne).toHaveBeenCalledWith('a1');
    expect(res.result).toBe('author');
  });

  it('returns error for unknown method', async () => {
    const res = await controller.rpc(
      { jsonrpc: '2.0', id: 1, method: 'bogus', params: {} } as any,
      req,
    );
    expect((res as any).error.code).toBe(-32601);
  });
});
