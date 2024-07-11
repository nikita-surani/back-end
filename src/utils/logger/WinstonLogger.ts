import * as path from 'path';
import { Injectable, LoggerService, Scope } from '@nestjs/common';
import { winston } from './winston';
import { BlogsError } from '../errors/';

@Injectable({ scope: Scope.TRANSIENT })
export class WinstonLogger implements LoggerService {
  public static DEFAULT_SCOPE = 'app';

  private static parsePathToScope(filepath: string): string {
    if (filepath.indexOf(path.sep) >= 0) {
      filepath = filepath
        .replace(process.cwd(), '')
        .replace(`src${path.sep}`, '')
        .replace(`dist${path.sep}`, '')
        .replace('.ts', '')
        .replace('.js', '')
        .replace(path.sep, '');
    }

    return filepath;
  }

  private static getCallingFunctionName(): string {
    try {
      const stack = new Error().stack;
      if (!stack) return 'Unknown Function';
      const lines = stack.split('\n');
      const callerLine = lines[4];
      const functionNameRegex = /\s+at (\S+)/;
      const matches = functionNameRegex.exec(callerLine);
      if (!matches || matches.length < 2) return 'Unknown Function';
      return matches[1];
    } catch (err) {
      return 'Unknown Function';
    }
  }
  private scope: string;

  constructor() {
    this.setScope();
  }

  public setScope(scope?: string): void {
    this.scope = WinstonLogger.parsePathToScope(
      scope ? scope : WinstonLogger.DEFAULT_SCOPE,
    );
  }

  public log(message: string, context: string): void {
    this.write('info', `[${context}] : ${message}`);
  }

  public debug(message: string, ...args: any[]): void {
    this.write('debug', message, args);
  }

  public info(message: string, ...args: any[]): void {
    this.write('info', message, ...args);
  }

  public warn(message: string, ...args: any[]): void {
    this.write('warn', message, args);
  }

  public error(message: string, trace?: string, context?: string, ...args: any[]): void {
    this.write('error', `[${context}] : ${message} \n ${trace}`, ...args);
  }

  public errorWithNoContext(message: string, trace?: string, ...args: any[]): void {
    this.write('error', `${message} \n ${trace}`, ...args);
  }

  public time(message: string, ...args: any[]): void {
    this.write('http', message, ...args);
  }

  private write(level: string, message: string, args?: any[]): void {
    if (winston) {
      const functionName = WinstonLogger.getCallingFunctionName();
      const scope = this.formatScope();
      const log = '{functionName}  | ' + message;
      winston[level](log, { ...args, functionName, scope });
    }
  }

  public logAndReturnError(error: BlogsError): any {
    const message = JSON.stringify(error);
    this.write('error', `[${error.code}] : ${message} \n ${error.category}`);
    return error;
  }

  private formatScope(): string {
    return this.scope;
  }
}
