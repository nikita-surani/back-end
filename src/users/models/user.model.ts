import { Entity, BaseEntity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { AuditInfo } from '../../core/domain';

import { AutoMap } from '@automapper/classes';
import { Posts } from '../../posts/models';
import { Comments } from '../../comments/models';

@Entity({
  schema: 'public',
  name: 'users',
})
export class Users extends BaseEntity {
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
    name: 'first_name',
    type: 'varchar',
    nullable: false,
  })
  private _firstName: string;

  @AutoMap()
  public get firstName(): string {
    return this._firstName;
  }

  @Column({
    name: 'last_name',
    type: 'varchar',
    nullable: false,
  })
  private _lastName: string;

  @AutoMap()
  public get lastName(): string {
    return this._lastName;
  }

  @Column({
    name: 'user_name',
    type: 'varchar',
    nullable: false,
  })
  private _userName: string;

  @AutoMap()
  public get userName(): string {
    return this._userName;
  }

  @Column({
    name: 'email_address',
    type: 'varchar',
    nullable: false,
  })
  private _emailAddress: string;

  @AutoMap()
  public get emailAddress(): string {
    return this._emailAddress;
  }

  @Column({
    name: 'password',
    type: 'varchar',
    nullable: true,
  })
  public _password: string;

  @AutoMap()
  public get password(): string {
    return this._password;
  }

  @Column(() => AuditInfo, { prefix: false })
  private _auditInfo: AuditInfo;

  @AutoMap()
  public get auditInfo(): AuditInfo {
    return this._auditInfo;
  }

  @OneToMany(() => Posts, (post: Posts) => post._user)
  public _post: Posts[];

  @AutoMap()
  public get post(): Posts[] {
    return this._post;
  }

  @OneToMany(() => Comments, (comment: Comments) => comment._user)
  public _comments: Comments[];

  @AutoMap()
  public get comments(): Comments[] {
    return this._comments;
  }

  constructor(
    id: string,
    firstName: string,
    lastName: string,
    userName: string,
    emailAddress: string,
    password: string,
    createdBy?: string,
  ) {
    super();
    this._id = id;
    this._firstName = firstName;
    this._lastName = lastName;
    this._userName = userName;
    this._emailAddress = emailAddress;
    this._password = password;
    this._auditInfo = new AuditInfo(createdBy);
  }
}
