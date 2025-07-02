import { Module } from '@nestjs/common';
import { McpController } from './mcp.controller';
import { BooksModule } from '../books/books.module';
import { AuthorsModule } from '../authors/authors.module';
import { CartModule } from '../cart/cart.module';
import { OrdersModule } from '../orders/orders.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [BooksModule, AuthorsModule, CartModule, OrdersModule, AuthModule],
  controllers: [McpController],
})
export class McpModule {}
