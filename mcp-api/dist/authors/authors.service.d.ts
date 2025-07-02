import { Repository } from 'typeorm';
import { Author } from '../database/entities/author.entity';
export declare class AuthorsService {
    private readonly repo;
    constructor(repo: Repository<Author>);
    paginate(page?: number, size?: number): Promise<{
        page: number;
        size: number;
        total: number;
        data: Author[];
    }>;
    findOne(id: string): Promise<Author>;
}
