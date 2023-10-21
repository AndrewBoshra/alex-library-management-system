import { InjectRepository } from '@nestjs/typeorm';
import { Book } from '@domain/entities/book.entity';
import { BorrowingRecordDto } from '@domain/dtos/borrowing-record.dto';
import { Borrower } from '@domain/entities/borrower.entity';
import { BorrowingRecord } from '@domain/entities/borrowing-record.entity';
import { Body, Controller, Injectable, Param, Post } from '@nestjs/common';
import { ApiTags, OmitType } from '@nestjs/swagger';
import { Repository } from 'typeorm';
import { BorrowerNotFoundException } from '@domain/exceptions/borrower-not-found';
import { NoBookWithIdException } from '@domain/exceptions/no-book-with-id';

@Injectable()
export class BorrowBook {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    @InjectRepository(Borrower)
    private readonly borrowerRepository: Repository<Borrower>,
    @InjectRepository(BorrowingRecord)
    private readonly borrowingRecordRepository: Repository<BorrowingRecord>,
  ) {}

  async execute(borrowingRecordDto: BorrowingRecordDto) {
    const borrower = await this.borrowerRepository.findOne({
      where: {
        id: borrowingRecordDto.borrowerId,
      },
      relations: ['borrowingRecords'],
    });

    if (!borrower) {
      throw new BorrowerNotFoundException(borrowingRecordDto.borrowerId);
    }

    const book = await this.bookRepository.findOne({
      where: {
        id: borrowingRecordDto.bookId,
      },
    });

    if (!book) {
      throw new NoBookWithIdException(borrowingRecordDto.bookId);
    }

    const borrowingRecord = borrower.borrowBook(book, borrowingRecordDto.dueAt);

    await this.borrowingRecordRepository.save(borrowingRecord);
    await this.bookRepository.save(book);
  }
}

class BorrowBookBody extends OmitType(BorrowingRecordDto, ['borrowerId']) {}

@ApiTags('borrowing')
@Controller('borrowers/:borrowerId/borrow')
export class BorrowBookController {
  constructor(private readonly borrowBookCommandHandler: BorrowBook) {}

  @Post()
  borrowBook(
    @Param('borrowerId') borrowerId: number,
    @Body() borrowingRecordDto: BorrowBookBody,
  ) {
    return this.borrowBookCommandHandler.execute({
      ...borrowingRecordDto,
      borrowerId,
    });
  }
}
