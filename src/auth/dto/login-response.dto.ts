import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  constructor(acces_token: string) {
    this.acces_token = acces_token;
  }

  @ApiProperty({
    description: 'The token to be returned',
    type: String,
  })
  acces_token: string;
}
