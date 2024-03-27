import { ApiProperty } from '@nestjs/swagger';

export class CreateUserResponseDto {
  constructor(message: string) {
    this.message = message;
  }

  @ApiProperty({
    description: 'The message to be returned',
    example: 'User [email] created successfully',
    type: String,
  })
  message: string;
}
