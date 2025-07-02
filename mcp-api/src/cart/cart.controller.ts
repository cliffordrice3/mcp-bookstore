import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  DefaultValuePipe,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cart: CartService) {}

  @Get()
  view(@Request() req) {
    return this.cart.get(req.user.userId);
  }

  @Post(':bookId/:qty?')
  add(
    @Request() req,
    @Param('bookId') bookId: string,
    @Param('qty', new DefaultValuePipe(1), ParseIntPipe) qty: number,
  ) {
    return this.cart.add(req.user.userId, bookId, qty);
  }

  @Delete(':bookId')
  remove(@Request() req, @Param('bookId') bookId: string) {
    return this.cart.remove(req.user.userId, bookId);
  }
}
