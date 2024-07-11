import { BlogsError, LoggingDescriptor } from '../../utils/errors';

export class ErrorDuplicateItem extends BlogsError {
  constructor(
    itemName: string,
    errorCode: string,
    itemTitle: string,
    criteria?: string,
    error?: any,
  ) {
    const message = `There was an error adding ${itemName}${
      criteria ? ` with the criteria provided. Criteria: ${criteria} with` : '.'
    } ${itemTitle} already exists.`;

    super(
      errorCode,
      itemName,
      `${itemName} already exists.`,
      new LoggingDescriptor(message, error),
    );
  }
}
