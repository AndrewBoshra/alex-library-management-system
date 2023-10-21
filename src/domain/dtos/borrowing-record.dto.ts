import { IsNumber, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BorrowingRecordStatus } from '@domain/entities/borrowing-record-status.enum';

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
  isOverdue?: boolean;
}
