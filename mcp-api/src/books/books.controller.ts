import { Controller, Get, Param, Query } from '@nestjs/common';
import { BooksService } from './books.service';
import { PaginateDto } from '../common/dto/paginate.dto';

@Controller('books')
export class BooksController {
  constructor(private books: BooksService) {}

  @Get()
  list(@Query() { page = 1, size = 20 }: PaginateDto) {
    return this.books.paginate(page, size);
  }

  @Get(':id')
  detail(@Param('id') id: string) {
    return this.books.findOne(id);
  }
}
