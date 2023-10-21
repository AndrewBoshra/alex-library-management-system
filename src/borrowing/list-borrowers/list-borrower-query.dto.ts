import { PageOptionsDto } from '@common/dto/page-options.dto';
import { IsString, IsOptional, IsEmail } from 'class-validator';

export class ListBorrowerQuery extends PageOptionsDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEmail()
  @IsOptional()
  email?: string;
}
