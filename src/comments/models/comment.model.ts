import {
  Entity,
  BaseEntity,
  Column,
  ManyToOne,
  PrimaryColumn,
  JoinColumn,
} from 'typeorm';
import { AutoMap } from '@automapper/classes';
import { AuditInfo } from '../../core/domain';
import { Users } from '../../users/models';
import { Posts } from '../../posts/models';

@Entity({
  schema: 'public',
  name: 'comments',
})
export class Comments extends BaseEntity {
  @PrimaryColumn({
    name: 'id',
    type: 'uuid',
    nullable: false,
  })
  private readonly _id: string;

  @AutoMap()
  public get id(): string {
    return this._id;
  }

  @Column({
    name: 'content',
    type: 'varchar',
    nullable: true,
  })
  private _content: string;

  @AutoMap()
  public get content(): string {
    return this._content;
  }

  @Column(() => AuditInfo, { prefix: false })
  private _auditInfo: AuditInfo;

  @AutoMap()
  public get auditInfo(): AuditInfo {
    return this._auditInfo;
  }

  @ManyToOne(() => Users, (user: Users) => user._comments, {
    persistence: true,
    eager: true,
  })
  @JoinColumn({ name: 'user_id' })
  public _user: Users;

  @AutoMap()
  public get user(): Users {
    return this._user;
  }

  @ManyToOne(() => Posts, (post: Posts) => post._comments, {
    persistence: true,
    eager: true,
  })
  @JoinColumn({ name: 'post_id' })
  public _post: Posts;

  @AutoMap()
  public get post(): Posts {
    return this._post;
  }

  constructor(
    id: string,
    content: string,
    user: Users,
    post: Posts,
    createdBy?: string,
  ) {
    super();
    this._id = id;
    this._content = content;
    this._user = user;
    this._post = post;
    this._auditInfo = new AuditInfo(createdBy);
  }
}
