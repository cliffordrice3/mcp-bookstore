import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrdersService } from './orders.service';
import { Order } from '../database/entities/order.entity';
import { OrderItem } from '../database/entities/order-item.entity';
import { Book } from '../database/entities/book.entity';
import { Cart } from '../cart/cart.service';

describe('OrdersService', () => {
  let service: OrdersService;
  let orderRepo: jest.Mocked<Repository<Order>>;
  let itemRepo: jest.Mocked<Repository<OrderItem>>;
  let bookRepo: jest.Mocked<Repository<Book>>;

  beforeEach(async () => {
    orderRepo = { create: jest.fn(), save: jest.fn(), findAndCount: jest.fn(), findOne: jest.fn() } as any;
    itemRepo = { create: jest.fn() } as any;
    bookRepo = { findByIds: jest.fn() } as any;

    const module = await Test.createTestingModule({
      providers: [
        OrdersService,
        { provide: getRepositoryToken(Order), useValue: orderRepo },
        { provide: getRepositoryToken(OrderItem), useValue: itemRepo },
        { provide: getRepositoryToken(Book), useValue: bookRepo },
      ],
    }).compile();

    service = module.get(OrdersService);
  });

  it('places an order', async () => {
    const cart: Cart = { items: [{ bookId: 'b1', quantity: 2 }] };
    bookRepo.findByIds.mockResolvedValueOnce([{ id: 'b1', price: 10 } as Book]);
    itemRepo.create.mockReturnValueOnce({} as OrderItem);
    orderRepo.create.mockReturnValueOnce({ items: [{}] } as Order);
    orderRepo.save.mockResolvedValueOnce({ id: 'o1' } as Order);

    await expect(service.place('u1', cart)).resolves.toEqual({ id: 'o1' });
    expect(bookRepo.findByIds).toHaveBeenCalled();
    expect(orderRepo.save).toHaveBeenCalled();
  });

  it('paginates orders', async () => {
    orderRepo.findAndCount.mockResolvedValueOnce([[{ id: 'o1' } as Order], 1]);
    await expect(service.paginate('u1', 1, 5)).resolves.toEqual({
      page: 1,
      size: 5,
      total: 1,
      data: [{ id: 'o1' }],
    });
  });

  it('finds one order', async () => {
    orderRepo.findOne.mockResolvedValueOnce({ id: 'o1' } as Order);
    await expect(service.findOne('u1', 'o1')).resolves.toEqual({ id: 'o1' });
  });

  it('throws when missing', async () => {
    orderRepo.findOne.mockResolvedValueOnce(null as any);
    await expect(service.findOne('u1', 'o1')).rejects.toThrow('Order o1 not found');
  });
});
