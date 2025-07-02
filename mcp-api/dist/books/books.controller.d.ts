import { BooksService } from './books.service';
import { PaginateDto } from '../common/dto/paginate.dto';
export declare class BooksController {
    private books;
    constructor(books: BooksService);
    list({ page, size }: PaginateDto): Promise<{
        page: number;
        size: number;
        total: number;
        data: import("../database/entities/book.entity").Book[];
    }>;
    detail(id: string): Promise<import("../database/entities/book.entity").Book>;
}
