"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const auth_module_1 = require("./auth/auth.module");
const books_module_1 = require("./books/books.module");
const authors_module_1 = require("./authors/authors.module");
const orders_module_1 = require("./orders/orders.module");
const cart_module_1 = require("./cart/cart.module");
const mcp_module_1 = require("./mcp/mcp.module");
const seed_service_1 = require("./database/seed.service");
let AppModule = class AppModule {
    seeder;
    constructor(seeder) {
        this.seeder = seeder;
    }
    async onModuleInit() {
        await this.seeder.seed();
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRootAsync({
                useFactory: () => ({
                    type: 'sqlite',
                    database: ':memory:',
                    entities: [__dirname + '/**/*.entity{.ts,.js}'],
                    synchronize: true,
                    dropSchema: true,
                }),
            }),
            auth_module_1.AuthModule,
            books_module_1.BooksModule,
            authors_module_1.AuthorsModule,
            orders_module_1.OrdersModule,
            cart_module_1.CartModule,
            mcp_module_1.McpModule,
        ],
        providers: [seed_service_1.SeedService],
    }),
    __metadata("design:paramtypes", [seed_service_1.SeedService])
], AppModule);
//# sourceMappingURL=app.module.js.map