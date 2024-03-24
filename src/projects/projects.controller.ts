import {
  Controller,
  Post,
  Body,
  HttpCode,
  UsePipes,
  ValidationPipe,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { Project } from './model/project.schema';
import { AuthGuard } from '../auth/auth.guard';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @UseGuards(AuthGuard)
  @Post('create')
  @HttpCode(201)
  @UsePipes(ValidationPipe)
  async create(
    @Body() createProjectDto: CreateProjectDto,
    @Request() req,
  ): Promise<{ message: string; project: Project }> {
    try {
      const userEmail = req.user.email;
      const newProject = await this.projectsService.create(
        createProjectDto.name,
        createProjectDto.description,
        userEmail,
      );
      return {
        message: 'Project [' + createProjectDto.name + '] created successfully',
        project: newProject,
      };
    } catch (error) {
      throw error;
    }
  }
}
