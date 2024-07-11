import { BadRequestException, PipeTransform } from '@nestjs/common';
import { WinstonLogger } from '../../utils/logger';
import { JsonPatchValidationPipe } from './json-patch-validation-pipe';

export class PatchValidationPipe implements PipeTransform {
  private logger: WinstonLogger = new WinstonLogger();
  validPath: string[];
  validDto: any;

  /**
   * both params will required.
   * @param validPath provide path object for validation.
   * @param validDto provide DTO class for every field validation.
   */
  constructor(validPath: any, validDto: any) {
    this.validPath = Object.values(validPath);
    this.validDto = validDto;
  }

  async validatePatchJson(bodyData: any): Promise<any> {
    if (!bodyData || !bodyData.length) {
      throw new BadRequestException(
        'Validation failed, Body should be an array of objects',
      );
    }

    const errors: any = [];

    for (const data of bodyData) {
      // validate json keys which are required.
      JsonPatchValidationPipe.toValidateKeys(data);

      // validate json key path values.
      const path = JsonPatchValidationPipe.validatePath(
        data.path,
        this.validPath,
      );

      // validate json op key values
      JsonPatchValidationPipe.validateOp(data.op);

      // validate json all fields value using provided Dto.
      const result = await JsonPatchValidationPipe.validateDtoValues(
        path,
        data.value,
        this.validDto,
      );

      // if validation failed then accumulate error messages.
      if (result instanceof BadRequestException) {
        const responseResult: any = result.getResponse();
        errors.push(...responseResult.message);
      }
    }
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    return bodyData;
  }

  async transform(bodyData: any): Promise<any> {
    this.logger.setScope(__filename);
    try {
      const result = await this.validatePatchJson(bodyData);
      return result;
    } catch (e) {
      this.logger.error(
        `Error in executing patch for Application.\n Message: ${e.message}`,
        e.stack,
      );
      throw new BadRequestException(e.response);
    }
  }
}
