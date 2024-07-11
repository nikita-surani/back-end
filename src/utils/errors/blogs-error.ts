export class ErrorModel {
  public message: string; // Exception message
  public stack: string; // Exception Stack trace

  /**
   *
   */
  constructor(message: string, stack: string) {
    this.message = message;
    this.stack = stack;
  }
}

export class LoggingDescriptor {
  public logMessage: string; // Exception message
  public exception: ErrorModel; // Exception Stack trace

  /**
   *
   */
  constructor(logMessage: string, exception?: any) {
    this.logMessage = logMessage;
    if (exception) {
      this.exception = new ErrorModel(exception?.message, exception?.stack);
    }
  }
}

export class BlogsError {
  public code: string;

  public category: string;

  public message: string; // Display Message, Will be used in front-end to display in UI

  public loggingDescriptor: LoggingDescriptor; // Internal use only , Will be used in log

  constructor(
    code: string,
    category: string,
    message: string,
    loggingDescriptor: LoggingDescriptor,
  ) {
    this.category = category;
    this.code = code;
    this.message = message;

    this.loggingDescriptor = loggingDescriptor;
  }
}
