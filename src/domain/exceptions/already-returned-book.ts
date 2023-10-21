import { DomainException } from '@common/exceptions/domain-exception';

export class AlreadyReturnedBookException extends DomainException {
  constructor(recordId: number) {
    super(`This record with id ${recordId} has already been returned`);
  }
}
