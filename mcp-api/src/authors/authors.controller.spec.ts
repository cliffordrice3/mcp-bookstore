import { Test } from '@nestjs/testing';
import { AuthorsController } from './authors.controller';
import { AuthorsService } from './authors.service';

describe('AuthorsController', () => {
  let controller: AuthorsController;
  let authors: jest.Mocked<AuthorsService>;

  beforeEach(async () => {
    authors = { paginate: jest.fn(), findOne: jest.fn() } as any;
    const module = await Test.createTestingModule({
      controllers: [AuthorsController],
      providers: [{ provide: AuthorsService, useValue: authors }],
    }).compile();
    controller = module.get(AuthorsController);
  });

  it('lists authors', () => {
    controller.list({ page: 1, size: 2 });
    expect(authors.paginate).toHaveBeenCalledWith(1, 2);
  });

  it('gets detail', () => {
    controller.detail('a1');
    expect(authors.findOne).toHaveBeenCalledWith('a1');
  });
});
