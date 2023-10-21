import { InjectRepository } from '@nestjs/typeorm';
import { Book } from '@domain/entities/book.entity';
import { BorrowingRecord } from '@domain/entities/borrowing-record.entity';
import { Controller, Injectable, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Repository } from 'typeorm';
import { BorrowingRecordNotFoundException } from '@domain/exceptions/borrowing-record-not-found';

@Injectable()
export class ReturnBook {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,

    @InjectRepository(BorrowingRecord)
    private readonly borrowingRecordRepository: Repository<BorrowingRecord>,
  ) {}

  async execute(returnBookCommand: ReturnBookCommand) {
    const borrowing = await this.borrowingRecordRepository.findOne({
      where: {
        id: returnBookCommand.recordId,
      },
      relations: ['book'],
    });

    if (!borrowing) {
      throw new BorrowingRecordNotFoundException(returnBookCommand.recordId);
    }

    borrowing.return();

    await this.borrowingRecordRepository.save(borrowing);
    await this.bookRepository.save(borrowing.book);

    return borrowing;
  }
}

class ReturnBookCommand {
  recordId: number;
}

@ApiTags('borrowing')
@Controller('borrowing-records/:recordId/return')
export class ReturnBookController {
  constructor(private readonly returnBookCommandHandler: ReturnBook) {}

  @Post()
  borrowBook(@Param('recordId') recordId: number) {
    return this.returnBookCommandHandler.execute({ recordId });
  }
}
