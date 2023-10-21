import { BookMapper } from '@books/mappers/book.mapper';
import { BorrowingRecordDto } from '@borrowing/dtos/borrowing-record.dto';
import { BorrowingRecord } from '@borrowing/entities/borrowing-record.entity';
import { BorrowerMapper } from './borrower.mapper';

export class BorrowingRecordMapper {
  static toEntity(borrowingRecordDto: BorrowingRecordDto): BorrowingRecord {
    return new BorrowingRecord({
      book: BookMapper.toEntity({
        id: borrowingRecordDto.bookId,
      }),
      borrower: BorrowerMapper.toEntity({
        id: borrowingRecordDto.borrowerId,
      }),
      dueAt: borrowingRecordDto.dueAt,
      bookId: borrowingRecordDto.bookId,
      borrowerId: borrowingRecordDto.borrowerId,
    });
  }

  static toDto(borrowingRecord: BorrowingRecord): BorrowingRecordDto {
    return {
      id: borrowingRecord.id,
      bookId: borrowingRecord.bookId,
      borrowerId: borrowingRecord.borrowerId,
      dueAt: borrowingRecord.dueAt,
    };
  }
}
