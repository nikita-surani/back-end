import { BadRequestException } from '@nestjs/common';
import { BlogsError } from '../utils/errors';
import { BoolResult } from './dto';

export class BaseController {
  public getResult(response: any): any {
    if (response instanceof BlogsError) {
      throw new BadRequestException(response);
    }
    if (typeof response === 'boolean') {
      return new BoolResult(response as boolean);
    }
    return response;
  }
}
