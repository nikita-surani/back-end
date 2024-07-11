import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from '@automapper/classes';
import { AuditInfoDto } from '../../core/dto';
import { Users } from '../../users/models';
import { Posts } from '../../posts/models';
import { v4 as uuid } from 'uuid';

export class CommentDisplayModel {
  @ApiProperty({ example: uuid() })
  @AutoMap()
  public id: string;

  @ApiProperty({ example: 'This is a comment content' })
  @AutoMap()
  public content: string;

  @ApiProperty({ type: Users })
  @AutoMap()
  public user: Users;

  @ApiProperty({ type: Posts })
  @AutoMap()
  public post: Posts;

  @ApiProperty({ type: AuditInfoDto })
  @AutoMap()
  public auditInfo: AuditInfoDto;
}
