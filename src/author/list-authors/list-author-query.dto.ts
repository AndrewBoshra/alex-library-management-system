import { PageOptionsDto } from '@common/dto/page-options.dto';
import { IsString, IsOptional } from 'class-validator';

export class ListAuthorsQuery extends PageOptionsDto {
  @IsString()
  @IsOptional()
  name?: string;
}
