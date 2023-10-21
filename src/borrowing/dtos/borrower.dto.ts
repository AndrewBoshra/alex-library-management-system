import { IsString, IsNotEmpty, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BorrowerDto {
  @ApiProperty({
    readOnly: true,
  })
  id: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    readOnly: true,
  })
  registeredAt: Date;
}
