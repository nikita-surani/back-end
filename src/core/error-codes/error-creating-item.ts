import { LoggingDescriptor, BlogsError } from '../../utils/errors';
export class ErrorCreatingItem extends BlogsError {
  constructor(
    itemName: string,
    errorCode: string,
    criteria?: string,
    error?: any,
  ) {
    const message = `There was an error adding ${itemName}${
      criteria ? ` with the criteria provided. Criteria: ${criteria}.` : '.'
    }`;

    super(
      errorCode,
      itemName,
      `There was an error adding the ${itemName}.`,
      new LoggingDescriptor(message, error),
    );
  }
}
