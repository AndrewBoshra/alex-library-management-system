import { NotFoundException } from '@common/exceptions/not-found-exception';

export class BorrowerNotFoundException extends NotFoundException {
  constructor(id) {
    super(`There is no borrower with id ${id}`);
  }
}
