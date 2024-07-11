import {
  Entity,
  BaseEntity,
  Column,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  JoinColumn,
} from 'typeorm';
import { AutoMap } from '@automapper/classes';
import { AuditInfo } from '../../core/domain';
import { Users } from '../../users/models';
import { Comments } from '../../comments/models';

@Entity({
  schema: 'public',
  name: 'posts',
})
export class Posts extends BaseEntity {
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
    name: 'title',
    type: 'varchar',
    nullable: false,
  })
  private _title: string;

  @AutoMap()
  public get title(): string {
    return this._title;
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

  @ManyToOne(() => Users, (user: Users) => user._post, {
    persistence: true,
    eager: true,
  })
  @JoinColumn({ name: 'user_id' })
  public _user: Users;

  @AutoMap()
  public get user(): Users {
    return this._user;
  }

  @OneToMany(() => Comments, (comment: Comments) => comment._post)
  public _comments: Comments[];

  @AutoMap()
  public get comments(): Comments[] {
    return this._comments;
  }

  constructor(
    id: string,
    title: string,
    content: string,
    user: Users,
    createdBy?: string,
  ) {
    super();
    this._id = id;
    this._title = title;
    this._content = content;
    this._user = user;
    this._auditInfo = new AuditInfo(createdBy);
  }

  update(title: string, content: string, updatedBy?: string): void {
    this._title = title;
    this._content = content;
    this._auditInfo.setUpdated(updatedBy);
  }
}
