import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';

const correctEmail = 'email@gmail.com';
const correctPassword = 'password';
const token = 'generated token';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            findOne: jest.fn().mockImplementation(async (email: string) => {
              if (email === correctEmail) {
                return {
                  email: correctEmail,
                  password: await bcrypt.hash(correctPassword, 10),
                };
              }
              return null;
            }),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn().mockResolvedValue(token),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sign in', () => {
    it('should return token if credentials are valid', async () => {
      const result = await service.signIn(correctEmail, correctPassword);
      expect(result).toEqual(token);
    });

    it('should throw an error if email invalid', async () => {
      const invalidEmail = 'wrong@gmail.com';
      await expect(
        service.signIn(invalidEmail, correctPassword),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw an error if password invalid', async () => {
      const invalidPassword = 'wrong-password';
      await expect(
        service.signIn(correctEmail, invalidPassword),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw an error if credentials are invalid', async () => {
      const invalidEmail = 'wrong@gmail.com';
      const invalidPassword = 'wrong-password';
      await expect(
        service.signIn(invalidEmail, invalidPassword),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
