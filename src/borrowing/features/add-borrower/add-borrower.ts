import { BorrowerDto } from '@borrowing/dtos/borrower.dto';
import { Borrower } from '@borrowing/entities/borrower.entity';
import { BorrowerMapper } from '@borrowing/mappers/borrower.mapper';
import { Body, Controller, Injectable, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AddBorrower {
  constructor(
    @InjectRepository(Borrower)
    private readonly borrowersRepository: Repository<Borrower>,
  ) {}

  async execute(borrowerDto: BorrowerDto): Promise<BorrowerDto> {
    const borrower = this.borrowersRepository.create(
      BorrowerMapper.toEntity(borrowerDto),
    );
    const savedBorrower = await this.borrowersRepository.save(borrower);
    return BorrowerMapper.toDto(savedBorrower);
  }
}

@ApiTags('borrowers')
@Controller('borrowers')
export class AddBorrowerController {
  constructor(private readonly addBorrower: AddBorrower) {}

  @Post()
  async create(@Body() borrower: BorrowerDto) {
    return await this.addBorrower.execute(borrower);
  }
}
