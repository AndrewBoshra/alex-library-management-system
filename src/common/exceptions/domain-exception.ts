export class DomainException {
  public readonly message: string;
  public readonly isDomainException: boolean = true;

  constructor(message) {
    this.message = message;
  }
}
