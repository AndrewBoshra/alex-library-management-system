import { BorrowerDto } from '@domain/dtos/borrower.dto';
import { Borrower } from '@domain/entities/borrower.entity';
import { BorrowerMapper } from '@domain/mappers/borrower.mapper';
import { Controller, Injectable, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ListBorrowers {
  constructor(
    @InjectRepository(Borrower)
    private readonly borrowersRepository: Repository<Borrower>,
  ) {}

  async execute(): Promise<BorrowerDto[]> {
    const bks = await this.borrowersRepository.find();
    return bks.map(BorrowerMapper.toDto);
  }
}

@ApiTags('borrowers')
@Controller('borrowers')
export class ListBorrowersController {
  constructor(private readonly listBorrowers: ListBorrowers) {}

  @Get()
  async create() {
    return await this.listBorrowers.execute();
  }
}
