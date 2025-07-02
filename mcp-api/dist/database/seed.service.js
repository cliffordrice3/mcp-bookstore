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
var SeedService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeedService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const faker_1 = require("@faker-js/faker");
const author_entity_1 = require("./entities/author.entity");
const book_entity_1 = require("./entities/book.entity");
let SeedService = SeedService_1 = class SeedService {
    authorRepo;
    bookRepo;
    logger = new common_1.Logger(SeedService_1.name);
    constructor(authorRepo, bookRepo) {
        this.authorRepo = authorRepo;
        this.bookRepo = bookRepo;
    }
    async seed() {
        const authors = [];
        for (let i = 0; i < 50; i++) {
            authors.push(await this.authorRepo.save(this.authorRepo.create({
                name: faker_1.faker.person.fullName(),
                bio: faker_1.faker.lorem.paragraph(),
            })));
        }
        for (let i = 0; i < 250; i++) {
            await this.bookRepo.save(this.bookRepo.create({
                title: faker_1.faker.lorem.words({ min: 2, max: 5 }),
                description: faker_1.faker.lorem.paragraphs({ min: 1, max: 3 }),
                price: faker_1.faker.number.int({ min: 5, max: 50 }),
                author: authors[faker_1.faker.number.int({ min: 0, max: 49 })],
            }));
        }
        this.logger.log(`Seeded ${authors.length} authors & 250 books`);
    }
};
exports.SeedService = SeedService;
exports.SeedService = SeedService = SeedService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(author_entity_1.Author)),
    __param(1, (0, typeorm_1.InjectRepository)(book_entity_1.Book)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], SeedService);
//# sourceMappingURL=seed.service.js.map