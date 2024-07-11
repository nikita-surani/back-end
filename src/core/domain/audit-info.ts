import { AutoMap } from '@automapper/classes';
import { Column, Entity } from 'typeorm';

@Entity()
export class AuditInfo {
  @Column({
    name: 'created_at',
    type: 'timestamp without time zone',
  })
  private readonly _createdAt: Date;

  @Column({
    name: 'created_by',
    type: 'uuid',
    nullable: true,
  })
  private readonly _createdBy?: string;

  @Column({
    name: 'updated_at',
    type: 'timestamp without time zone',
  })
  private _updatedAt: Date;

  @Column({
    name: 'updated_by',
    type: 'uuid',
    nullable: true,
  })
  private _updatedBy: string;

  @AutoMap()
  public get createdAt(): Date {
    return this._createdAt;
  }

  @AutoMap()
  public get createdBy(): string {
    return this._createdBy;
  }

  @AutoMap()
  public get updatedAt(): Date {
    return this._updatedAt;
  }

  @AutoMap()
  public get updatedBy(): string {
    return this._updatedBy;
  }

  constructor(createdBy: string) {
    if (createdBy) {
      this._createdBy = createdBy;
      this._updatedBy = createdBy;
      this._createdAt = new Date();
      this._updatedAt = new Date();
    } else {
      this._createdAt = this._updatedAt = new Date();
      this._createdBy = this._updatedBy = null;
    }
  }

  setUpdated(updatedBy?: string): any {
    this._updatedAt = new Date();
    this._updatedBy = updatedBy;
    return this;
  }
}
