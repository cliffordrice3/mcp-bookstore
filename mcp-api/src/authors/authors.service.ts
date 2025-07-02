import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Author } from '../database/entities/author.entity';

@Injectable()
export class AuthorsService {
  constructor(
    @InjectRepository(Author) private readonly repo: Repository<Author>,
  ) {}

  async paginate(page = 1, size = 20) {
    const [data, total] = await this.repo.findAndCount({
      skip: (page - 1) * size,
      take: size,
      order: { name: 'ASC' },
    });
    return { page, size, total, data };
  }

  async findOne(id: string) {
    const author = await this.repo.findOne({ where: { id } });
    if (!author) throw new NotFoundException(`Author ${id} not found`);
    return author;
  }
}
