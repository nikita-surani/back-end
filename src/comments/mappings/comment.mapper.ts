import { Mapper, createMap, forMember, mapWith } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { Comments } from '../models';
import { CommentDisplayModel } from '../dto';
import { UserDisplayModel } from '../../users/dto/user-display-model';
import { Users } from '../../users/models';
import { PostDisplayModel } from '../../posts/dto';
import { Posts } from '../../posts/models';

@Injectable()
export class CommentMapperProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      createMap(
        mapper,
        Comments,
        CommentDisplayModel,
        forMember(
          (d: CommentDisplayModel) => d.post,
          mapWith(PostDisplayModel, Posts, (source: Comments) => source.post),
        ),
        forMember(
          (d: CommentDisplayModel) => d.user,
          mapWith(UserDisplayModel, Users, (source: Comments) => source.user),
        ),
      );
    };
  }
}
