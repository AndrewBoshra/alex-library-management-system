import { IsNumber, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BorrowingRecordStatus } from '@domain/entities/borrowing-record-status.enum';
import { BookDto } from './book.dto';
import { BorrowerDto } from './borrower.dto';

export class BorrowingRecordDto {
  @ApiProperty({
    readOnly: true,
  })
  id: number;

  @IsDate()
  dueAt: Date;

  @IsNumber()
  bookId: number;

  @IsNumber()
  borrowerId: number;

  @ApiProperty({
    readOnly: true,
  })
  borrowedAt?: Date;

  @ApiProperty({
    readOnly: true,
  })
  returnedAt?: Date;

  @ApiProperty({
    readOnly: true,
  })
  status?: BorrowingRecordStatus;

  @ApiProperty({
    readOnly: true,
  })
  book: BookDto;

  @ApiProperty({
    readOnly: true,
  })
  borrower: BorrowerDto;
}
