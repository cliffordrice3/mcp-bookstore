import { Test } from '@nestjs/testing';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';

describe('BooksController', () => {
  let controller: BooksController;
  let books: jest.Mocked<BooksService>;

  beforeEach(async () => {
    books = { paginate: jest.fn(), findOne: jest.fn() } as any;
    const module = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [{ provide: BooksService, useValue: books }],
    }).compile();
    controller = module.get(BooksController);
  });

  it('lists books', () => {
    controller.list({ page: 1, size: 2 });
    expect(books.paginate).toHaveBeenCalledWith(1, 2);
  });

  it('gets detail', () => {
    controller.detail('b1');
    expect(books.findOne).toHaveBeenCalledWith('b1');
  });
});
