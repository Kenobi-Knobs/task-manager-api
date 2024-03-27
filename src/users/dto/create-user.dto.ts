import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, IsNotEmpty, IsEmail } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'The name of the user',
    minLength: 3,
    maxLength: 50,
    type: String,
    required: true,
  })
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  @Length(3, 50)
  readonly name: string;

  @ApiProperty({
    example: 'email@gmail.com',
    description: 'The email of the user',
    type: String,
    required: true,
  })
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
