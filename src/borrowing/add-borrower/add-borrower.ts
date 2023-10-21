import { BorrowerDto } from '@core/dtos/borrower.dto';
import { Borrower } from '@core/entities/borrower.entity';
import { BorrowerAlreadyExists } from '@core/exceptions/borrower-already-exists';
import { BorrowerMapper } from '@core/mappers/borrower.mapper';
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
    const alreadyExists = await this.borrowersRepository.exist({
      where: { email: borrowerDto.email },
    });

    if (alreadyExists) {
      throw new BorrowerAlreadyExists(borrowerDto.email);
    }
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
