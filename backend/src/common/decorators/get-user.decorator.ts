import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator((data: string | undefined, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const user = request.user;
  if (!user) return null;
  if (data === 'id' || data === '_id') {
    return user._id ? user._id.toString() : user.id;
  }
  return data ? user[data] : user;
});
