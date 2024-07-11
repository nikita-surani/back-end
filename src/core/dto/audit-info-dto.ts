import { IsOptional, IsDateString, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from '@automapper/classes';
import { v4 as uuid } from 'uuid';

export class AuditInfoDto {
  @IsDateString()
  @ApiProperty({ example: new Date() })
  @IsOptional()
  @AutoMap()
  public createdAt: Date;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: uuid() })
  @AutoMap()
  public createdBy?: string;

  @IsDateString()
  @IsOptional()
  @ApiProperty({ example: new Date() })
  @AutoMap()
  public updatedAt: Date;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: new Date() })
  @AutoMap()
  public updatedBy?: string;
}
