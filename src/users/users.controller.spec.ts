import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './users.controller';
import { UserService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './model/user.schema';
import { CreateUserResponseDto } from './dto/create-user-response.dto';
import { ConflictException } from '@nestjs/common';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
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

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const createUserDto = {
        name: 'John Doe',
        email: 'email@gmail.com',
        password: 'password',
      };

      jest.spyOn(service, 'create').mockImplementation(async () => {
        return Promise.resolve(new User());
      });

      const result = await controller.create(createUserDto);

      expect(service.create).toHaveBeenCalledWith(
        createUserDto.name,
        createUserDto.email,
        createUserDto.password,
      );
      expect(result).toEqual(
        new CreateUserResponseDto(
          'User [' + createUserDto.email + '] created successfully',
        ),
      );
    });

    it('should throw a ConflictException', () => {
      const createUserDto = {
        name: 'John Doe',
        email: 'email@gmail.com',
        password: 'password',
      };

      jest.spyOn(service, 'create').mockImplementation(async () => {
        throw { code: 11000 };
      });

      expect(controller.create(createUserDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });
});
