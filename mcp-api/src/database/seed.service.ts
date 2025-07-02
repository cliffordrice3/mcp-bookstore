import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { Author } from './entities/author.entity';
import { Book } from './entities/book.entity';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);
  constructor(
    @InjectRepository(Author) private authorRepo: Repository<Author>,
    @InjectRepository(Book) private bookRepo: Repository<Book>,
  ) {}
  async seed() {
    const authors: Author[] = [];
    for (let i = 0; i < 50; i++) {
      authors.push(
        await this.authorRepo.save(
          this.authorRepo.create({
            name: faker.person.fullName(),
            bio: faker.person.bio(),
          }),
        ),
      );
    }
    for (let i = 0; i < 250; i++) {
      await this.bookRepo.save(
        this.bookRepo.create({
          title: faker.book.title(),
          description: faker.lorem.paragraphs({ min: 1, max: 3 }),
          price: faker.number.int({ min: 5, max: 50 }),
          author: authors[faker.number.int({ min: 0, max: 49 })],
          genre: faker.book.genre(),
          publishedDate: faker.date.past(),
          stock: faker.number.int({ min: 0, max: 100 }),
        }),
      );
    }
    this.logger.log(`Seeded ${authors.length} authors & 250 books`);
  }
}
