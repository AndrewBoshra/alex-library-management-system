import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

/**
 * Validator for ISBNs.
 * Source http://www.hahnlibrary.net/libraries/isbncalc.html
 */
@ValidatorConstraint({ name: 'isbn', async: false })
export class IsbnValidator implements ValidatorConstraintInterface {
  validateISBN10(isbn: string) {
    let weightedSum = 0;
    for (let i = 0; i < 9; i++) {
      const weight = i + 1;
      weightedSum += parseInt(isbn[i]) * weight;
    }
    const checksum = isbn[9].toLowerCase() === 'x' ? 10 : parseInt(isbn[9]);
    return weightedSum % 11 === checksum;
  }

  validateISBN13(isbn: string) {
    let weightedSum = 0;
    for (let i = 0; i < 12; i++) {
      const weight = i % 2 === 0 ? 1 : 3;
      weightedSum += parseInt(isbn[i]) * weight;
    }
    const checksum = (10 - (weightedSum % 10)) % 10;
    return parseInt(isbn[12]) === checksum;
  }

  validate(isbn?: string) {
    if (isbn === undefined) return false;

    const cleanedIsbn = isbn.replace(/[-\s]/g, '');

    if (cleanedIsbn.length === 10) return this.validateISBN10(cleanedIsbn);

    if (cleanedIsbn.length === 13) return this.validateISBN13(cleanedIsbn);

    return false;
  }

  defaultMessage() {
    return 'ISBN is not valid.';
  }
}
