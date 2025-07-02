import { Repository } from 'typeorm';
import { Book } from '../database/entities/book.entity';
export declare class BooksService {
    private readonly repo;
    constructor(repo: Repository<Book>);
    paginate(page?: number, size?: number): Promise<{
        page: number;
        size: number;
        total: number;
        data: Book[];
    }>;
    findOne(id: string): Promise<Book>;
}
