import { Controller, Get, Param, Query } from '@nestjs/common';
import { AuthorsService } from './authors.service';
import { PaginateDto } from '../common/dto/paginate.dto';

@Controller('authors')
export class AuthorsController {
  constructor(private readonly authors: AuthorsService) {}

  @Get()
  list(@Query() { page = 1, size = 20 }: PaginateDto) {
    return this.authors.paginate(page, size);
  }

  @Get(':id')
  detail(@Param('id') id: string) {
    return this.authors.findOne(id);
  }
}
