import { ApiProperty } from '@nestjs/swagger';
import { Project } from '../model/project.schema';

export class ProjectResponseDto {
  constructor(message: string, project: Project) {
    this.message = message;
    this.project = project;
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
}
