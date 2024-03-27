import { IsEnum } from 'class-validator';
import { TaskStatus } from './enums/task-status.enum';
import { ApiProperty } from '@nestjs/swagger';

export class PromoteTaskDto {
  @ApiProperty({
    example: 'In Progress',
    description: 'The status of the task',
    type: String,
    required: true,
    enum: TaskStatus,
  })
  @IsEnum(TaskStatus)
  readonly status: TaskStatus;
}
