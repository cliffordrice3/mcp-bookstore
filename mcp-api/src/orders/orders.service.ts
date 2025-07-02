import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Order } from '../database/entities/order.entity';
import { OrderItem } from '../database/entities/order-item.entity';
import { Cart } from '../cart/cart.service';
import { Book } from '../database/entities/book.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private readonly orderRepo: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly itemRepo: Repository<OrderItem>,
    @InjectRepository(Book) private readonly bookRepo: Repository<Book>,
  ) {}

  /** Convert a cart into an order and persist it */
  async place(userId: string, cart: Cart) {
    // look up prices to keep them immutable
    const books = await this.bookRepo.findBy({
      id: In(cart.items.map((i) => i.bookId)),
    });

    const outOfStock = cart.items.filter((ci) => {
      const book = books.find((b) => b.id === ci.bookId);
      return !book || book.stock < ci.quantity;
    });

    if (outOfStock.length > 0) {
      throw new Error(
        `Out of stock: ${outOfStock.map((i) => i.bookId).join(', ')}`,
      );
    }

    const order = this.orderRepo.create({
      userId,
      items: cart.items.map((ci) => {
        const book = books.find((b) => b.id === ci.bookId);
        return this.itemRepo.create({
          bookId: ci.bookId,
          quantity: ci.quantity,
          price: book?.price ?? 0,
        });
      }),
    });

    books.forEach((book) => {
      book.stock -= cart.items.find((i) => i.bookId === book.id)?.quantity ?? 0;
    });

    const [result] = await Promise.all([
      this.orderRepo.save(order),
      this.bookRepo.save(books),
    ]);

    return result;
  }

  /** Paginated list of a user’s orders */
  async paginate(userId: string, page = 1, size = 20) {
    const [data, total] = await this.orderRepo.findAndCount({
      where: { userId },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * size,
      take: size,
    });
    return { page, size, total, data };
  }

  /** Single order with items */
  async findOne(userId: string, id: string) {
    const order = await this.orderRepo.findOne({ where: { id, userId } });
    if (!order) throw new NotFoundException(`Order ${id} not found`);
    return order;
  }
}
