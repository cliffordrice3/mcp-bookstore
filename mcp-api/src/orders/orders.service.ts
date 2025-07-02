import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
    const books = await this.bookRepo.findByIds(
      cart.items.map((i) => i.bookId),
    );

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
    return this.orderRepo.save(order);
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
