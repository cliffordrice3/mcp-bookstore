import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SeedService } from './seed.service';
import { Author } from './entities/author.entity';
import { Book } from './entities/book.entity';

describe('SeedService', () => {
  let service: SeedService;
  let authorRepo: jest.Mocked<Repository<Author>>;
  let bookRepo: jest.Mocked<Repository<Book>>;

  beforeEach(async () => {
    authorRepo = { create: jest.fn((a) => a), save: jest.fn(async (a) => ({ id: 'a', ...a })) } as any;
    bookRepo = { create: jest.fn((b) => b), save: jest.fn(async (b) => ({ id: 'b', ...b })) } as any;
    const module = await Test.createTestingModule({
      providers: [
        SeedService,
        { provide: getRepositoryToken(Author), useValue: authorRepo },
        { provide: getRepositoryToken(Book), useValue: bookRepo },
      ],
    }).compile();
    service = module.get(SeedService);
  });

  it('seeds authors and books', async () => {
    await service.seed();
    expect(authorRepo.save).toHaveBeenCalled();
    expect(bookRepo.save).toHaveBeenCalled();
  });
});
