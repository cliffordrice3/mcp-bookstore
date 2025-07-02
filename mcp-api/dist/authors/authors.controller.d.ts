import { AuthorsService } from './authors.service';
import { PaginateDto } from '../common/dto/paginate.dto';
export declare class AuthorsController {
    private readonly authors;
    constructor(authors: AuthorsService);
    list({ page, size }: PaginateDto): Promise<{
        page: number;
        size: number;
        total: number;
        data: import("../database/entities/author.entity").Author[];
    }>;
    detail(id: string): Promise<import("../database/entities/author.entity").Author>;
}
