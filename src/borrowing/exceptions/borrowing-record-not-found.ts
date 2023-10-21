import { NotFoundException } from '@common/exceptions/not-found-exception';

export class BorrowingRecordNotFoundException extends NotFoundException {
  constructor(recordId: number) {
    super(`Borrowing record with id ${recordId} not found`);
  }
}
