import { IsMongoId } from 'class-validator';

export class TaskIdDto {
  @IsMongoId({ message: 'Invalid task ID' })
  id: string;
}
