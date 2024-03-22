import { IsString, Length, IsNotEmpty, IsEmail } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  @Length(3, 50)
  readonly name: string;

  @IsEmail()
  readonly email: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @Length(6, 50, { message: 'Password must be at least 6 characters' })
  readonly password: string;
}
