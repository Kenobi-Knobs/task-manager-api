import {
  Controller,
  Post,
  Body,
  HttpCode,
  UsePipes,
  ValidationPipe,
  Request,
  UseGuards,
  Get,
  Patch,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './model/project.schema';
import { AuthGuard } from '../auth/auth.guard';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  @HttpCode(201)
  @Post('create')
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

  @UseGuards(AuthGuard)
  @HttpCode(200)
  @Get(':id')
  async findById(@Request() req): Promise<Project> {
    try {
      const project = await this.projectsService.findById(req.params.id);
      if (!project) {
        throw new NotFoundException();
      }
      return project;
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  @HttpCode(200)
  @Patch(':id')
  async update(
    @Body() updateProjectDto: UpdateProjectDto,
    @Request() req,
  ): Promise<{ message: string; project: Project }> {
    try {
      const updatedProject = await this.projectsService.update(
        req.params.id,
        updateProjectDto.name,
        updateProjectDto.description,
      );
      if (!updatedProject) {
        throw new NotFoundException();
      }
      return {
        message: 'Project [' + updateProjectDto.name + '] updated successfully',
        project: updatedProject,
      };
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(AuthGuard)
  @HttpCode(200)
  @Delete(':id')
  async delete(@Request() req): Promise<{ message: string; project: Project }> {
    try {
      const deletedProject = await this.projectsService.delete(req.params.id);
      if (!deletedProject) {
        throw new NotFoundException();
      }
      return {
        message: 'Project [' + deletedProject.name + '] deleted successfully',
        project: deletedProject,
      };
    } catch (error) {
      throw error;
    }
  }
}
