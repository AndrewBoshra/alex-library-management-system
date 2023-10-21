import { InjectRepository } from '@nestjs/typeorm';
import { Book } from '@books/entities/book.entity';
import { BorrowingRecordDto } from '@borrowing/dtos/borrowing-record.dto';
import { Borrower } from '@borrowing/entities/borrower.entity';
import { BorrowingRecord } from '@borrowing/entities/borrowing-record.entity';
import { BorrowingRecordMapper } from '@borrowing/mappers/borrowing-record.mapper';
import { DomainException } from '@common/exceptions/domain-exception';
import { Body, Controller, Injectable, Param, Post } from '@nestjs/common';
import { ApiTags, OmitType } from '@nestjs/swagger';
import { Repository } from 'typeorm';
import { BorrowerNotFoundException } from '@borrowing/exceptions/borrower-not-found';

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

    book.checkOut();

    const borrowingRecord = this.borrowingRecordRepository.create(
      BorrowingRecordMapper.toEntity(borrowingRecordDto),
    );

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

class NoBookWithIdException extends DomainException {
  constructor(bookId: number) {
    super(`No book with id ${bookId}`);
  }
}
