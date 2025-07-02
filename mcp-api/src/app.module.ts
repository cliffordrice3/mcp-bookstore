import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { BooksModule } from './books/books.module';
import { AuthorsModule } from './authors/authors.module';
import { OrdersModule } from './orders/orders.module';
import { CartModule } from './cart/cart.module';
import { McpModule } from './mcp/mcp.module';
import { SeedService } from './database/seed.service';

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
