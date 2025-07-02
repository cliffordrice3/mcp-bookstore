import { Injectable } from '@nestjs/common';

export interface CartItem {
  bookId: string;
  quantity: number;
}
export interface Cart {
  items: CartItem[];
}

@Injectable()
export class CartService {
  private carts = new Map<string, Cart>(); // key = userId

  get(userId: string): Cart {
    return this.carts.get(userId) ?? { items: [] };
  }

  add(userId: string, bookId: string, qty = 1) {
    const cart = this.get(userId);
    const existing = cart.items.find((i) => i.bookId === bookId);

    if (existing) {
      existing.quantity += qty;
    } else {
      cart.items.push({ bookId, quantity: qty });
    }

    this.carts.set(userId, cart);
    return cart;
  }

  remove(userId: string, bookId: string) {
    const cart = this.get(userId);
    cart.items = cart.items.filter((i) => i.bookId !== bookId);
    this.carts.set(userId, cart);
    return cart;
  }

  clear(userId: string) {
    this.carts.delete(userId);
  }
}
