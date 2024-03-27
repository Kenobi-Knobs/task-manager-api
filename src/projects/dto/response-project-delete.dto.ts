import { ApiProperty } from '@nestjs/swagger';
import { Project } from '../model/project.schema';

export class ProjectDeleteResponseDto {
  constructor(message: string, project: Project, taskUpdated: number) {
    this.message = message;
    this.project = project;
    this.taskUpdated = taskUpdated;
  }

  @ApiProperty({
    description: 'The message to be returned',
    type: String,
  })
  message: string;

  @ApiProperty({
    description: 'The project to be returned',
    type: Project,
  })
  project: Project;

  @ApiProperty({
    description: 'The number of tasks deleted',
    type: Number,
  })
  taskUpdated: number;
}
