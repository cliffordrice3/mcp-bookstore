import { Test } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

jest.mock('bcrypt', () => ({
  hashSync: () => 'hash',
  compareSync: (p: string, h: string) => p === 'demo',
}));

describe('AuthController', () => {
  let controller: AuthController;
  let auth: jest.Mocked<AuthService>;

  beforeEach(async () => {
    auth = { login: jest.fn() } as any;
    const module = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: auth }],
    }).compile();
    controller = module.get(AuthController);
  });

  it('delegates login', async () => {
    auth.login.mockResolvedValue({ t: 1 } as any);
    await controller.login({ username: 'demo', password: 'demo' });
    expect(auth.login).toHaveBeenCalled();
  });
});
