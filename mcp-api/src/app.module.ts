import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { AuthorsModule } from './authors/authors.module';
import { BooksModule } from './books/books.module';
import { CartModule } from './cart/cart.module';
import { Author } from './database/entities/author.entity';
import { Book } from './database/entities/book.entity';
import { SeedService } from './database/seed.service';
import { McpModule } from './mcp/mcp.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'sqlite',
        database: ':memory:',
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
        dropSchema: true,
      }),
    }),
    TypeOrmModule.forFeature([Author, Book]),
    AuthModule,
    BooksModule,
    AuthorsModule,
    OrdersModule,
    CartModule,
    McpModule,
  ],
  providers: [SeedService],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly seeder: SeedService) {}
  async onModuleInit() {
    await this.seeder.seed();
  }
}
