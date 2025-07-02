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
exports.McpController = void 0;
const common_1 = require("@nestjs/common");
const jwt_guard_1 = require("../auth/jwt.guard");
const books_service_1 = require("../books/books.service");
const authors_service_1 = require("../authors/authors.service");
const cart_service_1 = require("../cart/cart.service");
const orders_service_1 = require("../orders/orders.service");
let McpController = class McpController {
    books;
    authors;
    cart;
    orders;
    constructor(books, authors, cart, orders) {
        this.books = books;
        this.authors = authors;
        this.cart = cart;
        this.orders = orders;
    }
    async rpc(body, req) {
        const { method, params } = body;
        const uid = req.user.userId;
        try {
            let result;
            switch (method) {
                case 'listInventory':
                    result = await this.books.paginate(params.page ?? 1, params.size ?? 20);
                    break;
                case 'bookDetails':
                    result = await this.books.findOne(params.id);
                    break;
                case 'authorDetails':
                    result = await this.authors.findOne(params.id);
                    break;
                case 'addToCart':
                    result = this.cart.add(uid, params.bookId, params.qty ?? 1);
                    break;
                case 'removeFromCart':
                    result = this.cart.remove(uid, params.bookId);
                    break;
                case 'viewCart':
                    result = this.cart.get(uid);
                    break;
                case 'placeOrder':
                    result = await this.orders.place(uid, this.cart.get(uid));
                    this.cart.clear(uid);
                    break;
                case 'listOrders':
                    result = await this.orders.paginate(uid, params.page ?? 1, params.size ?? 20);
                    break;
                case 'orderDetails':
                    result = await this.orders.findOne(uid, params.id);
                    break;
                default:
                    throw new Error('Method not found', { cause: -32601 });
            }
            return { jsonrpc: '2.0', id: body.id, result };
        }
        catch (e) {
            return {
                jsonrpc: '2.0',
                id: body.id,
                error: { code: e.cause ?? -32603, message: e.message },
            };
        }
    }
};
exports.McpController = McpController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], McpController.prototype, "rpc", null);
exports.McpController = McpController = __decorate([
    (0, common_1.Controller)('mcp'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [books_service_1.BooksService,
        authors_service_1.AuthorsService,
        cart_service_1.CartService,
        orders_service_1.OrdersService])
], McpController);
//# sourceMappingURL=mcp.controller.js.map