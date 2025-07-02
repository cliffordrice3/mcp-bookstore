import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Author } from './author.entity';

@Entity()
export class Book {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @Column() title!: string;
  @Column('text') description!: string;
  @Column('int') price!: number;
  @Column() genre!: string;
  @Column('date') publishedDate!: Date;
  @Column('int', { default: 0 }) stock!: number;

  @ManyToOne(() => Author, (author) => author.books, { eager: true })
  author!: Author;
}
