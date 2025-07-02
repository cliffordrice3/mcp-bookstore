import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from '../database/entities/book.entity';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book) private readonly repo: Repository<Book>,
  ) {}

  async paginate(page = 1, size = 20) {
    const [data, total] = await this.repo.findAndCount({
      skip: (page - 1) * size,
      take: size,
      order: { title: 'ASC' },
    });
    return { page, size, total, data };
  }

  async findOne(id: string) {
    const book = await this.repo.findOne({ where: { id } });
    if (!book) throw new NotFoundException(`Book ${id} not found`);
    return book;
  }
}
