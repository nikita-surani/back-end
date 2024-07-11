import {
  Controller,
  Body,
  Post,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AddUserModel, loginModel } from '../users/dto';
import { BaseController } from '../core/base.controller';
import { BlogsError } from '../utils/errors';
import { UsersService } from '../users/services/user.service';

@ApiTags('Auth')
@Controller()
export class AuthController extends BaseController {
  constructor(
    private _authService: AuthService,
    private _usersService: UsersService,
  ) {
    super();
  }

  @ApiOperation({ summary: 'Login using email-address and password' })
  @ApiResponse({ status: HttpStatus.OK })
  @HttpCode(201)
  @Post('/login')
  async login(
    @Body() data: loginModel,
  ): Promise<{ accessToken: string } | BlogsError> {
    return this.getResult(await this._authService.login(data));
  }

  @ApiOperation({ summary: 'Login using email-address and password' })
  @Post('signup')
  async signUp(
    @Body() data: AddUserModel,
  ): Promise<any | BlogsError> {
    return this.getResult(await this._usersService.createUser(data));
  }
}
