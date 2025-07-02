import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Author } from '../database/entities/author.entity';
import { AuthorsService } from './authors.service';

describe('AuthorsService', () => {
  let service: AuthorsService;
  let repo: jest.Mocked<Repository<Author>>;

  beforeEach(async () => {
    repo = {
      findAndCount: jest.fn(),
      findOne: jest.fn(),
    } as any;

    const module = await Test.createTestingModule({
      providers: [
        AuthorsService,
        { provide: getRepositoryToken(Author), useValue: repo },
      ],
    }).compile();
    service = module.get(AuthorsService);
  });

  it('paginates authors', async () => {
    repo.findAndCount.mockResolvedValueOnce([[{ id: 'a1' } as Author], 1]);
    await expect(service.paginate(1, 5)).resolves.toEqual({
      page: 1,
      size: 5,
      total: 1,
      data: [{ id: 'a1' }],
    });
    expect(repo.findAndCount).toHaveBeenCalledWith({
      skip: 0,
      take: 5,
      order: { name: 'ASC' },
    });
  });

  it('finds one author', async () => {
    repo.findOne.mockResolvedValueOnce({ id: 'a1' } as Author);
    await expect(service.findOne('a1')).resolves.toEqual({ id: 'a1' });
  });

  it('throws when author missing', async () => {
    repo.findOne.mockResolvedValueOnce(null as any);
    await expect(service.findOne('a1')).rejects.toThrow('Author a1 not found');
  });
});
