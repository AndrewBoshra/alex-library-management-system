import { DomainException } from '@common/exceptions/domain-exception';

export class NoAuthorWithIdException extends DomainException {
  constructor(id) {
    super(`There is no author with id ${id}`);
  }
}
