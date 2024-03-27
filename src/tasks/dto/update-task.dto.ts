import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, IsNotEmpty } from 'class-validator';

export class UpdateTaskDto {
  @ApiProperty({
    example: 'Do anything',
    description: 'The name of the task',
    minLength: 3,
    maxLength: 100,
    type: String,
    required: true,
  })
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  @Length(3, 100)
  readonly name: string;

  @ApiProperty({
    example: 'Some task description text',
    description: 'The description of the task',
    minLength: 3,
    maxLength: 500,
    type: String,
    required: true,
  })
  @IsString()
  @IsNotEmpty({ message: 'Description is required' })
  @Length(3, 500)
  readonly description: string;
}
