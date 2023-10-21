import { PageOptionsDto } from '@common/dto/page-options.dto';
import { IsOptional, IsNumber, IsEnum } from 'class-validator';
import { BorrowingRecordStatus } from '@core/entities/borrowing-record-status.enum';
import { ApiProperty } from '@nestjs/swagger';

export class ListBorrowingRecordsQuery extends PageOptionsDto {
  @ApiProperty({
    enum: BorrowingRecordStatus,
    enumName: 'BorrowingRecordStatus',
    required: false,
  })
  @IsEnum(BorrowingRecordStatus)
  @IsOptional()
  status?: string;

  @IsNumber()
  @IsOptional()
  bookId?: number;
}
