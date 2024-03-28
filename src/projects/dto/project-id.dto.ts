import { IsMongoId } from 'class-validator';

export class ProjectIdDto {
  @IsMongoId({ message: 'Invalid project ID' })
  id: string;
}
