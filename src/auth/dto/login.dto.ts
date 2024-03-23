import { IsString, Length, IsNotEmpty, IsEmail } from 'class-validator';

export class LoginDto {
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail()
  readonly email: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @Length(6, 50, { message: 'Password must be at least 6 characters' })
  readonly password: string;
}
