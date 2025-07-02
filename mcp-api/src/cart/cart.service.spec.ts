import { CartService } from './cart.service';

describe('CartService', () => {
  let service: CartService;

  beforeEach(() => {
    service = new CartService();
  });

  it('initially returns empty cart', () => {
    expect(service.get('user1')).toEqual({ items: [] });
  });

  it('adds items and increments quantity', () => {
    service.add('u1', 'b1');
    service.add('u1', 'b1');
    service.add('u1', 'b2', 3);
    expect(service.get('u1')).toEqual({
      items: [
        { bookId: 'b1', quantity: 2 },
        { bookId: 'b2', quantity: 3 },
      ],
    });
  });

  it('removes items', () => {
    service.add('u1', 'b1');
    service.add('u1', 'b2');
    service.remove('u1', 'b1');
    expect(service.get('u1')).toEqual({
      items: [{ bookId: 'b2', quantity: 1 }],
    });
  });

  it('clears cart', () => {
    service.add('u1', 'b1');
    service.clear('u1');
    expect(service.get('u1')).toEqual({ items: [] });
  });
});
