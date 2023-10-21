import { BookReport } from '@core/dtos/books-report';
import { Book } from './book.entity';
import { BorrowingRecordStatus } from './borrowing-record-status.enum';

const toMinutes = (milliseconds: number) => milliseconds / 1000 / 60;

const arrayAverage = (arr: any[]) =>
  arr.reduce((acc, val) => acc + val, 0) / arr.length;

export class BorrowingReportCalculator {
  static calculate(book: Book): BookReport {
    const overdueReturnedRecords = book.borrowingRecords.filter(
      (record) => record.status === BorrowingRecordStatus.ReturnedOverdue,
    );
    const overdueNotReturnedRecords = book.borrowingRecords.filter(
      (record) => record.status === BorrowingRecordStatus.Overdue,
    );
    const notOverDueNotReturnedRecords = book.borrowingRecords.filter(
      (record) => record.status === BorrowingRecordStatus.Borrowed,
    );

    const returnedInTimeRecords = book.borrowingRecords.filter(
      (record) => record.status === BorrowingRecordStatus.Returned,
    );

    const allReturnedRecords = book.borrowingRecords.filter(
      (record) => record.isReturned,
    );

    return {
      id: book.id,
      title: book.title,
      isbn: book.isbn,
      availableQuantity: book.availableQuantity,
      shelfLocation: book.shelfLocation,
      authorId: book.author?.id,
      authorName: book.author?.name,
      borrowedCount: book.borrowingRecords.length,
      returnedInTimeCount: returnedInTimeRecords.length,

      notReturnedYetCount: notOverDueNotReturnedRecords.length,
      returnedOverDueCount: overdueReturnedRecords.length,
      notReturnedOverDueCount: overdueNotReturnedRecords.length,

      avgOverdueDuration: toMinutes(
        arrayAverage(
          overdueReturnedRecords.map((record) => record.overDueDuration),
        ),
      ),

      avgBorrowingDuration: toMinutes(
        arrayAverage(
          allReturnedRecords.map((record) => record.borrowingDuration),
        ),
      ),
    };
  }
}
