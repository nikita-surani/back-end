import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength } from 'class-validator';

export class AddPostModel {
  @ApiProperty({ example: 'string' })
  @IsString()
  @MinLength(5)
  @MaxLength(100)
  title: string;

  @ApiProperty({ example: 'string' })
  @IsString()
  @MinLength(10)
  @MaxLength(500)
  content: string;

  constructor(title: string, content: string) {
    this.title = title;
    this.content = content;
  }
}
