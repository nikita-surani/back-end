import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class loginModel {
  @IsNotEmpty()
  @ApiProperty({ example: 'string' })
  public emailAddress: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'string' })
  public password: string;
}
