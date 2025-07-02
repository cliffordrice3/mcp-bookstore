import { Test } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { CartService } from '../cart/cart.service';

describe('OrdersController', () => {
  let controller: OrdersController;
  let orders: jest.Mocked<OrdersService>;
  let cart: jest.Mocked<CartService>;

  beforeEach(async () => {
    orders = { place: jest.fn(), paginate: jest.fn(), findOne: jest.fn() } as any;
    cart = { get: jest.fn(), clear: jest.fn() } as any;
    const module = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        { provide: OrdersService, useValue: orders },
        { provide: CartService, useValue: cart },
      ],
    }).compile();
    controller = module.get(OrdersController);
  });

  const req = { user: { userId: 'u1' } } as any;

  it('places order', async () => {
    cart.get.mockReturnValueOnce({} as any);
    orders.place.mockResolvedValueOnce({ id: 'o1' } as any);
    await controller.place(req);
    expect(cart.clear).toHaveBeenCalledWith('u1');
    expect(orders.place).toHaveBeenCalled();
  });

  it('lists orders', () => {
    controller.list(req, { page: 1, size: 2 });
    expect(orders.paginate).toHaveBeenCalledWith('u1', 1, 2);
  });

  it('gets order detail', () => {
    controller.detail(req, 'o1');
    expect(orders.findOne).toHaveBeenCalledWith('u1', 'o1');
  });
});
