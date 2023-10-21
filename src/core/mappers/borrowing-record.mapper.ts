import { BookMapper } from '@core/mappers/book.mapper';
import { BorrowingRecordDto } from '@core/dtos/borrowing-record.dto';
import { BorrowingRecord } from '@core/entities/borrowing-record.entity';
import { BorrowerMapper } from './borrower.mapper';
import { BorrowingRecordCsv } from '@core/dtos/borrowing-record-csv';

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
      borrowedAt: borrowingRecord.borrowedAt,
      returnedAt: borrowingRecord.returnedAt,
      status: borrowingRecord.status,
      book: borrowingRecord.book && BookMapper.toDto(borrowingRecord.book),
      borrower:
        borrowingRecord.borrower &&
        BorrowerMapper.toDto(borrowingRecord.borrower),
    };
  }

  static toCSVRow(borrowingRecord: BorrowingRecord): BorrowingRecordCsv {
    return {
      id: borrowingRecord.id,
      bookId: borrowingRecord.bookId,
      dueAt: borrowingRecord.dueAt,
      borrowedAt: borrowingRecord.borrowedAt,
      returnedAt: borrowingRecord.returnedAt,
      status: borrowingRecord.status,
      bookTitle: borrowingRecord.book && borrowingRecord.book.title,
      borrowerId: borrowingRecord.borrowerId,
      borrowerEmail: borrowingRecord.borrower && borrowingRecord.borrower.email,
      borrowerName: borrowingRecord.borrower && borrowingRecord.borrower.name,
    };
  }
}
