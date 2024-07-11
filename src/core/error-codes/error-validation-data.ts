import { BlogsError, LoggingDescriptor } from '../../utils/errors';

export class ErrorValidation extends BlogsError {
  constructor(
    itemName: string,
    message: string,
    logMessage?: string,
    error?: any,
  ) {
    super(
      'ERR_VALIDATION',
      itemName,
      message,
      new LoggingDescriptor(logMessage, error),
    );
  }
}
