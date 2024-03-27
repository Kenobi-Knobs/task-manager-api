import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, IsNotEmpty, IsEmail } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'email@gmail.com',
    description: 'The email of the user',
    type: String,
    required: true,
  })
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    example: 'password',
    description: 'The password of the user',
    minLength: 6,
    maxLength: 50,
    type: String,
    required: true,
  })
  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @Length(6, 50, { message: 'Password must be at least 6 characters' })
  readonly password: string;
}
