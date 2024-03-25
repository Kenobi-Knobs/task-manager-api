import { IsEnum } from 'class-validator';
import { TaskStatus } from './enums/task-status.enum';

export class PromoteTaskDto {
  @IsEnum(TaskStatus)
  readonly status: TaskStatus;
}
