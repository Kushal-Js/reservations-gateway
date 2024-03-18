import { UnauthorizedException } from '@nestjs/common';
import { app } from './app';
import { ClientProxy } from '@nestjs/microservices';
import { AUTH_SERVICE } from '@app/common';
//import { lastValueFrom } from 'rxjs';

export const authContext = async ({ res }) => {
  try {
    const authClient = app.get<ClientProxy>(AUTH_SERVICE);
    return authClient.send('validateToken', {
      Authentication: res.headers?.authentication,
    });
  } catch (err) {
    throw new UnauthorizedException(err);
  }
};
