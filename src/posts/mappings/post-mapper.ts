import { Mapper, createMap, forMember, mapWith } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { Posts } from '../models';
import { PostDisplayModel } from '../dto';
import { Users } from '../../users/models';
import { UserDisplayModel } from '../../users/dto';

@Injectable()
export class PostMapperProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      createMap(
        mapper,
        Posts,
        PostDisplayModel,
        forMember(
          (d: PostDisplayModel) => d.user,
          mapWith(
            UserDisplayModel,
            Users,
            (source: Posts) => source.user,
          ),
        ),
      );
    };
  }
}
