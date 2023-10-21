import { IsNumber, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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
}
