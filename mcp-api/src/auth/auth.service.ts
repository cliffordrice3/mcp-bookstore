import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

const DEMO_USER = {
  id: 'u-demo',
  username: 'demo',
  passwordHash: bcrypt.hashSync('demo', 8),
};

@Injectable()
export class AuthService {
  constructor(private jwt: JwtService) {}
  async login({ username, password }: { username: string; password: string }) {
    if (
      username !== DEMO_USER.username ||
      !bcrypt.compareSync(password, DEMO_USER.passwordHash)
    ) {
      throw new UnauthorizedException();
    }
    return { access_token: await this.jwt.signAsync({ sub: DEMO_USER.id }) };
  }
}
