import { Borrower } from '@borrowing/entities/borrower.entity';
import { BorrowerNotFoundException } from '@borrowing/exceptions/borrower-not-found';
import { Param, Controller, Injectable, Delete } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

class DeleteBorrowerCommand {
  id: number;
}

@Injectable()
export class DeleteBorrower {
  constructor(
    @InjectRepository(Borrower)
    private readonly borrowersRepository: Repository<Borrower>,
  ) {}

  async execute(command: DeleteBorrowerCommand) {
    const { id } = command;

    const originalBorrower = await this.borrowersRepository.findOne({
      where: { id },
    });

    if (!originalBorrower) {
      throw new BorrowerNotFoundException(id);
    }

    await this.borrowersRepository.delete(id);
  }
}

@ApiTags('borrowers')
@Controller('borrowers')
export class DeleteBorrowerController {
  constructor(private readonly addBorrower: DeleteBorrower) {}

  @Delete(':id')
  async create(@Param('id') id: number) {
    return await this.addBorrower.execute({ id });
  }
}
