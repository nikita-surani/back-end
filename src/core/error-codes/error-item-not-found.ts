import { LoggingDescriptor, BlogsError } from '../../utils/errors';
export class ErrorItemNotFound extends BlogsError {
  constructor(
    itemName: string,
    errorCode: string,
    criteria?: string,
    error?: any,
  ) {
    const message = `${itemName} not found for the criteria provided. Criteria: ${criteria}`;
    super(
      errorCode,
      itemName,
      `${itemName} not found for the criteria provided.`,
      new LoggingDescriptor(message, error),
    );
  }
}
