import {
  Controller,
  Post,
  Get,
  Param,
  Request,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { OrdersService } from './orders.service';
import { CartService } from '../cart/cart.service';
import { PaginateDto } from '../common/dto/paginate.dto';

@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(
    private orders: OrdersService,
    private cart: CartService,
  ) {}

  @Post()
  async place(@Request() req) {
    const order = await this.orders.place(
      req.user.userId,
      this.cart.get(req.user.userId),
    );
    this.cart.clear(req.user.userId);
    return order;
  }

  @Get()
  list(@Request() req, @Query() { page = 1, size = 20 }: PaginateDto) {
    return this.orders.paginate(req.user.userId, page, size);
  }

  @Get(':id')
  detail(@Request() req, @Param('id') id: string) {
    return this.orders.findOne(req.user.userId, id);
  }
}
