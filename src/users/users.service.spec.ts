import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './model/user.schema';

class UserModel {
  constructor(private data) {}
  save = jest.fn().mockResolvedValue(this.data);
  static findOne = jest.fn().mockReturnThis();
  static exec = jest.fn();
}

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getModelToken(User.name), useValue: UserModel },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a user with hashed password', async () => {
      const name = 'User name';
      const email = 'email@gmail.com';
      const password = 'password';

      const result = await service.create(name, email, password);
      expect(result.name).toEqual(name);
      expect(result.email).toEqual(email);
      expect(result.password).not.toEqual(password);
    });
  });

  describe('findOne', () => {
    it('should find a user by email', async () => {
      const email = 'email@gmail.com';
      const user = { name: 'User name', email, password: 'hashed-password' };

      UserModel.exec.mockResolvedValueOnce(user);

      const result = await service.findOne(email);
      expect(UserModel.findOne).toHaveBeenCalledWith({ email });
      expect(result).toEqual(user);
    });
  });
});
