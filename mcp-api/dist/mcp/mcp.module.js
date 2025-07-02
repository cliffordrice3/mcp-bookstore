"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.McpModule = void 0;
const common_1 = require("@nestjs/common");
const mcp_controller_1 = require("./mcp.controller");
const books_module_1 = require("../books/books.module");
const authors_module_1 = require("../authors/authors.module");
const cart_module_1 = require("../cart/cart.module");
const orders_module_1 = require("../orders/orders.module");
const auth_module_1 = require("../auth/auth.module");
let McpModule = class McpModule {
};
exports.McpModule = McpModule;
exports.McpModule = McpModule = __decorate([
    (0, common_1.Module)({
        imports: [books_module_1.BooksModule, authors_module_1.AuthorsModule, cart_module_1.CartModule, orders_module_1.OrdersModule, auth_module_1.AuthModule],
        controllers: [mcp_controller_1.McpController],
    })
], McpModule);
//# sourceMappingURL=mcp.module.js.map