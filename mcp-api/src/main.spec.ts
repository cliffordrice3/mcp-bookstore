import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

jest.mock('@nestjs/core', () => ({ NestFactory: { create: jest.fn() } }));
jest.mock('./app.module', () => ({ AppModule: class {} }));

describe('bootstrap', () => {
  it('creates app and listens', async () => {
    const useGlobalPipes = jest.fn();
    const listen = jest.fn();
    (NestFactory.create as jest.Mock).mockResolvedValue({
      useGlobalPipes,
      listen,
    });

    await import('./main');
    expect(NestFactory.create).toHaveBeenCalledWith(AppModule);
    expect(useGlobalPipes).toHaveBeenCalled();
    expect(listen).toHaveBeenCalledWith(3000);
  });
});
