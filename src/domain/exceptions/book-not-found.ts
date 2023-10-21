import { NotFoundException } from '@common/exceptions/not-found-exception';

export class BookNotFoundException extends NotFoundException {
  constructor(id) {
    super(`There is no book with id ${id}`);
  }
}
