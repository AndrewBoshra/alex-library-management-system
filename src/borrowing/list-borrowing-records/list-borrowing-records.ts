import { BorrowingRecordDto } from '@domain/dtos/borrowing-record.dto';
import { Borrower } from '@domain/entities/borrower.entity';
import { BorrowingRecord } from '@domain/entities/borrowing-record.entity';
import { BorrowerNotFoundException } from '@domain/exceptions/borrower-not-found';
import { BorrowingRecordMapper } from '@domain/mappers/borrowing-record.mapper';
import { Controller, Injectable, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ListBorrowingRecords {
  constructor(
    @InjectRepository(BorrowingRecord)
    private readonly borrowingRecordRepository: Repository<BorrowingRecord>,
    @InjectRepository(Borrower)
    private readonly borrowerRepository: Repository<Borrower>,
  ) {}

  async execute({
    borrowerId,
  }: {
    borrowerId: number;
  }): Promise<BorrowingRecordDto[]> {
    const borrower = await this.borrowerRepository.findOne({
      where: {
        id: borrowerId,
      },
    });

    if (!borrower) {
      throw new BorrowerNotFoundException(borrowerId);
    }

    const bks = await this.borrowingRecordRepository.find({
      where: {
        borrowerId,
      },
    });
    return bks.map(BorrowingRecordMapper.toDto);
  }
}

@ApiTags('borrowing')
@Controller('borrowers')
export class ListBorrowingRecordsController {
  constructor(private readonly listBorrowingRecords: ListBorrowingRecords) {}

  @Get(':borrowerId/borrowing-records')
  async get(@Param('borrowerId') borrowerId: number) {
    return await this.listBorrowingRecords.execute({
      borrowerId,
    });
  }
}
