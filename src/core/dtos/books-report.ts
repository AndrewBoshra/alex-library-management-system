export class BookReport {
  id: number;
  title?: string;
  isbn?: string;
  availableQuantity?: number;
  shelfLocation?: string;
  authorId?: number;
  authorName?: string;

  borrowedCount?: number;

  notReturnedYetCount?: number;
  returnedInTimeCount?: number;
  returnedOverDueCount?: number;
  notReturnedOverDueCount?: number;

  // the avg duration of all returned borrowings,
  // either overdue or not
  avgBorrowingDuration?: number;

  //the avg duration that the borrowings are overdue after return date
  avgOverdueDuration?: number;
}
