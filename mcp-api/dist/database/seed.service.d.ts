import { Repository } from 'typeorm';
import { Author } from './entities/author.entity';
import { Book } from './entities/book.entity';
export declare class SeedService {
    private authorRepo;
    private bookRepo;
    private readonly logger;
    constructor(authorRepo: Repository<Author>, bookRepo: Repository<Book>);
    seed(): Promise<void>;
}
