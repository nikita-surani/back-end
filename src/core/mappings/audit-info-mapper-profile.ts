import { createMap, Mapper } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { AuditInfo } from '../domain';
import { AuditInfoDto } from '../dto';

@Injectable()
export class AuditInfoMapperProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }
  override get profile() {
    return (mapper: Mapper) => {
      createMap(mapper, AuditInfo, AuditInfoDto);
    };
  }
}
