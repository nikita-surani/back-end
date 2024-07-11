import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { AuditInfoDto } from '../../core/dto';
import { v4 as uuid } from 'uuid';

export class UserDisplayModel {
  @ApiProperty({ example: uuid() })
  @AutoMap()
  public id: string;

  @ApiProperty({ example: 'John' })
  @AutoMap()
  public firstName: string;

  @ApiProperty({ example: 'Doe' })
  @AutoMap()
  public lastName: string;

  @ApiProperty({ example: 'john_doe' })
  @AutoMap()
  public userName: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  @AutoMap()
  public emailAddress: string;

  @ApiProperty({ type: AuditInfoDto })
  @AutoMap()
  public auditInfo: AuditInfoDto;
}
