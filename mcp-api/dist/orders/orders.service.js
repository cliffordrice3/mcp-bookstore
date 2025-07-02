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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const order_entity_1 = require("../database/entities/order.entity");
const order_item_entity_1 = require("../database/entities/order-item.entity");
const book_entity_1 = require("../database/entities/book.entity");
let OrdersService = class OrdersService {
    orderRepo;
    itemRepo;
    bookRepo;
    constructor(orderRepo, itemRepo, bookRepo) {
        this.orderRepo = orderRepo;
        this.itemRepo = itemRepo;
        this.bookRepo = bookRepo;
    }
    async place(userId, cart) {
        const books = await this.bookRepo.findByIds(cart.items.map((i) => i.bookId));
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
    async paginate(userId, page = 1, size = 20) {
        const [data, total] = await this.orderRepo.findAndCount({
            where: { userId },
            order: { createdAt: 'DESC' },
            skip: (page - 1) * size,
            take: size,
        });
        return { page, size, total, data };
    }
    async findOne(userId, id) {
        const order = await this.orderRepo.findOne({ where: { id, userId } });
        if (!order)
            throw new common_1.NotFoundException(`Order ${id} not found`);
        return order;
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(1, (0, typeorm_1.InjectRepository)(order_item_entity_1.OrderItem)),
    __param(2, (0, typeorm_1.InjectRepository)(book_entity_1.Book)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], OrdersService);
//# sourceMappingURL=orders.service.js.map