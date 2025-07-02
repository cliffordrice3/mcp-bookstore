import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from '../database/entities/book.entity';
import { BooksService } from './books.service';

describe('BooksService', () => {
  let service: BooksService;
  let repo: jest.Mocked<Repository<Book>>;

  beforeEach(async () => {
    repo = {
      findAndCount: jest.fn(),
      findOne: jest.fn(),
    } as any;

    const module = await Test.createTestingModule({
      providers: [BooksService, { provide: getRepositoryToken(Book), useValue: repo }],
    }).compile();
    service = module.get(BooksService);
  });

  it('paginates books', async () => {
    repo.findAndCount.mockResolvedValueOnce([[{ id: 'b1' } as Book], 1]);
    await expect(service.paginate(1, 10)).resolves.toEqual({
      page: 1,
      size: 10,
      total: 1,
      data: [{ id: 'b1' }],
    });
    expect(repo.findAndCount).toHaveBeenCalledWith({
      skip: 0,
      take: 10,
      order: { title: 'ASC' },
    });
  });

  it('finds one book', async () => {
    repo.findOne.mockResolvedValueOnce({ id: 'b1' } as Book);
    await expect(service.findOne('b1')).resolves.toEqual({ id: 'b1' });
  });

  it('throws when book missing', async () => {
    repo.findOne.mockResolvedValueOnce(null as any);
    await expect(service.findOne('b1')).rejects.toThrow('Book b1 not found');
  });
});
