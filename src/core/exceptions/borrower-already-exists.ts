import { DomainException } from '@common/exceptions/domain-exception';

export class BorrowerAlreadyExists extends DomainException {
  constructor(email) {
    super(`Borrower with email ${email} already exists`);
  }
}
