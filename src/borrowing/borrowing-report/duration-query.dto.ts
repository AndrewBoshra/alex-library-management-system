import { IsDate, IsOptional } from 'class-validator';

export class DurationQuery {
  @IsDate()
  @IsOptional()
  startDateTime?: Date;
  @IsDate()
  @IsOptional()
  endDateTime?: Date;
}
