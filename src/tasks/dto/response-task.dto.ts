import { ApiProperty } from '@nestjs/swagger';
import { Task } from '../model/task.schema';

export class TaskResponseDto {
  constructor(message: string, task: Task) {
    this.message = message;
    this.task = task;
  }

  @ApiProperty({
    description: 'The message to be returned',
    type: String,
  })
  message: string;

  @ApiProperty({
    description: 'The task to be returned',
    type: Task,
  })
  task: Task;
}
