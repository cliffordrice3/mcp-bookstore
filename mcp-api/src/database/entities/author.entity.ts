import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Book } from './book.entity';

@Entity()
export class Author {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @Column() name!: string;
  @Column('text') bio!: string;

  @OneToMany(() => Book, (book) => book.author) books!: Book[];
}
