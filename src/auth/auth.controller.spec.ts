import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/users.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from '../users/model/user.schema';
import { LoginResponseDto } from './dto/login-response.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        JwtService,
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: {
            new: jest.fn(),
            constructor: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            exec: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return a token', async () => {
      const loginDto = {
        email: 'email@gmail.com',
        password: 'password',
      };

      jest.spyOn(service, 'signIn').mockImplementation(async () => {
        return Promise.resolve('token');
      });

      const result = await controller.login(loginDto);

      expect(service.signIn).toHaveBeenCalledWith(
        loginDto.email,
        loginDto.password,
      );

      expect(result).toEqual(new LoginResponseDto('token'));
    });
  });
});
