"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
let CartService = class CartService {
    carts = new Map();
    get(userId) {
        return this.carts.get(userId) ?? { items: [] };
    }
    add(userId, bookId, qty = 1) {
        const cart = this.get(userId);
        const existing = cart.items.find((i) => i.bookId === bookId);
        if (existing) {
            existing.quantity += qty;
        }
        else {
            cart.items.push({ bookId, quantity: qty });
        }
        this.carts.set(userId, cart);
        return cart;
    }
    remove(userId, bookId) {
        const cart = this.get(userId);
        cart.items = cart.items.filter((i) => i.bookId !== bookId);
        this.carts.set(userId, cart);
        return cart;
    }
    clear(userId) {
        this.carts.delete(userId);
    }
};
exports.CartService = CartService;
exports.CartService = CartService = __decorate([
    (0, common_1.Injectable)()
], CartService);
//# sourceMappingURL=cart.service.js.map