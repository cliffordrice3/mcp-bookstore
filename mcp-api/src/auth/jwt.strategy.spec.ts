import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
  it('maps payload to user object', () => {
    const strat = new JwtStrategy();
    expect(strat.validate({ sub: 'u1' })).toEqual({ userId: 'u1' });
  });
});
