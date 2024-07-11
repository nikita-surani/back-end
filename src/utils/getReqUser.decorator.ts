import { createParamDecorator } from '@nestjs/common';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const GetReqUser = createParamDecorator((data, req) => {
  return req.args[0].user;
});