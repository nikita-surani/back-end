import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AddCommentDto {
  @ApiProperty({ example: 'This is a comment.' })
  @IsNotEmpty()
  @IsString()
  content: string;
}
