import { BorrowerDto } from '@domain/dtos/borrower.dto';
import { Borrower } from '@domain/entities/borrower.entity';
import { BorrowerAlreadyExists } from '@domain/exceptions/borrower-already-exists';
import { BorrowerNotFoundException } from '@domain/exceptions/borrower-not-found';
import { BorrowerMapper } from '@domain/mappers/borrower.mapper';
import { Body, Controller, Injectable, Put, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';

@Injectable()
export class UpdateBorrower {
  constructor(
    @InjectRepository(Borrower)
    private readonly borrowersRepository: Repository<Borrower>,
  ) {}

  async execute(command: UpdateBorrowerCommand) {
    const { id, borrowerDto } = command;

    const originalBorrower = await this.borrowersRepository.findOne({
      where: { id },
    });

    if (!originalBorrower) {
      throw new BorrowerNotFoundException(id);
    }
    const alreadyExists = await this.borrowersRepository.exist({
      where: { email: borrowerDto.email, id: Not(id) },
    });

    if (alreadyExists) {
      throw new BorrowerAlreadyExists(borrowerDto.email);
    }
    borrowerDto.id = id;
    const updatedBorrower = BorrowerMapper.toEntity(borrowerDto);
    const savedBorrower = await this.borrowersRepository.save(updatedBorrower);
    return BorrowerMapper.toDto(savedBorrower);
  }
}

@ApiTags('borrowers')
@Controller('borrowers')
export class UpdateBorrowerController {
  constructor(private readonly updateBorrower: UpdateBorrower) {}

  @Put(':id')
  async create(@Param('id') id: number, @Body() borrower: BorrowerDto) {
    return await this.updateBorrower.execute({
      id,
      borrowerDto: borrower,
    });
  }
}

class UpdateBorrowerCommand {
  public readonly id: number;
  public readonly borrowerDto: BorrowerDto;
}
