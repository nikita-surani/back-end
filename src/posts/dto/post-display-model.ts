import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { AuditInfoDto } from '../../core/dto';
import { Users } from '../../users/models';
import { v4 as uuid } from 'uuid';


export class PostDisplayModel {
  @ApiProperty({ example: uuid() })
  @AutoMap()
  public id: string;

  @ApiProperty({ example: 'string' })
  @AutoMap()
  public title: string;

  @ApiProperty({ example: 'string' })
  @AutoMap()
  public content: string;

  @ApiProperty({ type: Users })
  @AutoMap()
  public user: Users;

  @ApiProperty({ type: AuditInfoDto })
  @AutoMap()
  public auditInfo: AuditInfoDto;
}
