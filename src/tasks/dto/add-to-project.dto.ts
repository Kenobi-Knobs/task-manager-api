import { IsMongoId } from 'class-validator';

export class AddToProjectDto {
  @IsMongoId({ message: 'Invalid task ID' })
  id: string;

  @IsMongoId({ message: 'Invalid project ID' })
  projectId: string;
}
