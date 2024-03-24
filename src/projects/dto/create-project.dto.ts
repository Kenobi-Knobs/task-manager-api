import { IsString, Length, IsNotEmpty } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  @Length(3, 100)
  readonly name: string;

  @IsString()
  @IsNotEmpty({ message: 'Description is required' })
  @Length(3, 500)
  readonly description: string;
}
