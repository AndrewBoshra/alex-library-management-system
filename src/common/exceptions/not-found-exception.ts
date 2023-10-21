import { DomainException } from './domain-exception';

export class NotFoundException extends DomainException {
  constructor(message) {
    super(message);
  }
}
