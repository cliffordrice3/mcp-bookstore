import { Test } from '@nestjs/testing';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

describe('CartController', () => {
  let controller: CartController;
  let cart: jest.Mocked<CartService>;

  beforeEach(async () => {
    cart = { get: jest.fn(), add: jest.fn(), remove: jest.fn() } as any;
    const module = await Test.createTestingModule({
      controllers: [CartController],
      providers: [{ provide: CartService, useValue: cart }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();
    controller = module.get(CartController);
  });

  const req = { user: { userId: 'u1' } } as any;

  it('views cart', () => {
    cart.get.mockReturnValue({ items: [] });
    expect(controller.view(req)).toEqual({ items: [] });
    expect(cart.get).toHaveBeenCalledWith('u1');
  });

  it('adds item', () => {
    controller.add(req, 'b1', 2);
    expect(cart.add).toHaveBeenCalledWith('u1', 'b1', 2);
  });

  it('removes item', () => {
    controller.remove(req, 'b1');
    expect(cart.remove).toHaveBeenCalledWith('u1', 'b1');
  });
});
