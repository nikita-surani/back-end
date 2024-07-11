import { LoggingDescriptor, BlogsError } from '../../utils/errors/';
export class ErrorUpdatingItem extends BlogsError {
  constructor(
    itemName: string,
    errorCode: string,
    criteria?: string,
    error?: any,
  ) {
    const message = `There was an error updating the ${itemName}${
      criteria ? ` with the criteria provided. Criteria: ${criteria}.` : '.'
    }`;
    super(
      errorCode,
      itemName,
      `There was an error updating the ${itemName} for the criteria provided.`,
      new LoggingDescriptor(message, error),
    );
  }
}
