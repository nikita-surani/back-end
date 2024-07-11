import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

import { Transform } from 'class-transformer';
const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]+$/;
const MessageConstants = {
  PASSWORD:
    'Password must contain at least one capital letter, one number, and one special character.',
};
export class AddUserModel {
  @ApiProperty({ example: 'string' })
  // @NotEmptyString()
  // @AlphaNumericWithSpaces()
  // @IsNotOnlyNumbers()
  @Transform(({ value }) => value?.trim())
  firstName: string;

  @ApiProperty({ example: 'string' })
  // @NotEmptyString()
  // @AlphaNumericWithSpaces()
  // @IsNotOnlyNumbers()
  @Transform(({ value }) => value?.trim())
  lastName: string;

  @ApiProperty({ example: 'string' })
  @Transform(({ value }) => value?.trim())
  userName: string;

  @ApiProperty({ example: 'string' })
  @IsEmail()
  emailAddress: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @Matches(passwordRegex, {
    message: MessageConstants.PASSWORD,
  })
  @ApiProperty({ example: 'string' })
  public password: string;

  constructor(
    firstName: string,
    lastName: string,
    userName: string,
    emailAddress: string,
    password: string,
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.userName = userName;
    this.emailAddress = emailAddress;
    this.password = password;
  }
}
