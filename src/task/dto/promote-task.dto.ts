import { IsEnum } from 'class-validator';

export enum TaskStatus {
  New = 'New',
  InProgress = 'In Progress',
  Done = 'Done',
}

export class PromoteTaskDto {
  @IsEnum(TaskStatus)
  readonly status: TaskStatus;
}
