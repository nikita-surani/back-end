import { HttpStatus } from '@nestjs/common';
import { ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { Type } from '@nestjs/common';

export const ApiPagedCollectionResponse = <TModel extends Type<any>>(
  model: TModel,
): any => {
  return applyDecorators(
    ApiResponse({
      status: HttpStatus.OK,
      schema: {
        allOf: [
          {
            properties: {
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
              currentPageNumber: {
                type: 'number',
                example: 0,
              },
              recordsPerPage: {
                type: 'number',
                example: 0,
              },
              totalRecords: {
                type: 'number',
                example: 0,
              },
              totalPages: {
                type: 'number',
                example: 0,
              },
            },
          },
        ],
      },
    }),
  );
};
