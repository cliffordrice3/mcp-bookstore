import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';

jest.mock('bcrypt', () => ({
  hashSync: () => 'hash',
  compareSync: (p: string, h: string) => p === 'demo',
}));

describe('AuthService', () => {
  let service: AuthService;
  let jwt: jest.Mocked<JwtService>;

  beforeEach(async () => {
    jwt = { signAsync: jest.fn().mockResolvedValue('token') } as any;
    const module = await Test.createTestingModule({
      providers: [AuthService, { provide: JwtService, useValue: jwt }],
    }).compile();
    service = module.get(AuthService);
  });

  it('returns token on valid credentials', async () => {
    await expect(service.login({ username: 'demo', password: 'demo' })).resolves.toEqual({ access_token: 'token' });
  });

  it('throws on invalid credentials', async () => {
    await expect(service.login({ username: 'bad', password: 'demo' })).rejects.toThrow();
  });
});
