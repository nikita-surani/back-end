// import {
//   AssetMediaTypeEnum,
//   AssetFileTypeEnum,
// } from '../../asset-media/enum/asset-media-type-enum';
import { BadRequestException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { isString, maxLength, validateOrReject } from 'class-validator';
// import { hasAllKeys } from '../../utils/helpers';

export const isValidStatus = (value: any, validData): boolean => {
  const index = validData.includes(value);
  return index ? value : false;
};

const IsNotEmpty = (value: any, type: any, path?: any): any => {
  if (!value) {
    if (path) {
      throw new BadRequestException(
        `Validation failed, ${type} of ${path} should not be empty`,
      );
    }
    throw new BadRequestException(
      `Validation failed, ${type} must not be empty`,
    );
  }
};

export const isValidPathStatus = (status: any, validPath): any => {
  const allStatus = status.split('/');
  return validPath.includes(allStatus[1]);
};

export class JsonPatchValidationPipe {
  public static toValidateKeys(value): any {
    const validKeys = ['value', 'path', 'op'];
    const keys = Object.keys(value);
    if (validKeys.length !== keys.length) {
      throw new BadRequestException(
        `Valid keys '${validKeys.join(', ')}' are required`,
      );
    }
    const isValidKey = keys.every((key: any) => isValidStatus(key, validKeys));
    if (!isValidKey) {
      const notFound = keys
        .filter((queryKey: any) => !isValidStatus(queryKey, validKeys))
        .join(', ');
      throw new BadRequestException(
        `Validation failed, Invalid Key : ${notFound}`,
      );
    }
  }

  public static validatePath(path: string, validPath): any {
    IsNotEmpty(path, 'path');
    if (!isValidPathStatus(path, validPath)) {
      throw new BadRequestException(
        `Validation failed, Invalid path : ${path}`,
      );
    }
    return path.split('/')[1];
  }

  public static validateOp(value, validOperation?: string[]): any {
    IsNotEmpty(value, 'op');
    const validOp = validOperation
      ? validOperation
      : ['replace', 'add', 'remove'];
    if (!isValidStatus(value, validOp)) {
      throw new BadRequestException(
        `Validation failed, Invalid value for op : ${value} must be ${validOp.toString()} `,
      );
    }
  }

  public static toValidateValue(
    value,
    path?,
    skipCheckEmpty: boolean = false,
    skipLengthValidation: boolean = false,
  ): any {
    const maxCharacters = 255;
    if (!skipCheckEmpty) {
      IsNotEmpty(value, 'value', path);
    }
    if (!isString(value)) {
      throw new BadRequestException(
        `Validation failed, ${path} : '${value}' must be a string`,
      );
    }
    if (!maxLength(value, maxCharacters) && !skipLengthValidation) {
      throw new BadRequestException(
        `Validation failed, ${path} : '${value}' must be less than or equal to ${maxCharacters} characters`,
      );
    }
  }

  public static toValidateWhiteSpace(value: any, path: string): void {
    if (typeof value !== 'string') {
      throw new BadRequestException(
        `Validation failed, ${path}: '${value}' should be a string.`,
      );
    }

    if (value.trim().length === 0) {
      throw new BadRequestException(
        `Validation failed, ${path}: '${value}' must not be empty or contain only whitespace.`,
      );
    }
  }

  public static async validateDtoValues(
    path: string,
    value: any,
    validDto: any,
  ): Promise<any> {
    const dataObj = { [path]: value };

    // convert object to given Dto.
    const dtoObject: object = plainToClass(validDto, dataObj);

    try {
      await validateOrReject(dtoObject);
      return true;
    } catch (validationErrors) {
      const pathError = validationErrors.find((x: any) => x.property === path);

      if (pathError && pathError.constraints) {
        const errors: string[] = Object.values(pathError.constraints);
        return new BadRequestException(errors);
      }
      return true;
    }
  }

  public static validateRegex(
    regex: any,
    value: any,
    path: string,
    errorMessage: any,
  ): void {
    if (!regex.test(value)) {
      throw new BadRequestException(
        `Validation failed, ${path}: '${value} ${errorMessage}`,
      );
    }
  }

  public static toValidateObject(value: any): void {
    if (!Object.keys(value).length || !Object.values(value).length) {
      throw new BadRequestException(
        'Validation failed. Object should have key and value pairs',
      );
    }
  }

  public static toValidateEnum(value: any, type: any): void {
    if (!type.includes(value)) {
      throw new BadRequestException(
        'Validation failed. value must be a valid enum type',
      );
    }
  }
}
