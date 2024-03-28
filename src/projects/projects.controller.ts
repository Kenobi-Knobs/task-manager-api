import {
  Controller,
  Post,
  Body,
  HttpCode,
  UseGuards,
  Get,
  Patch,
  Delete,
  NotFoundException,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './model/project.schema';
import { AuthGuard } from '../auth/auth.guard';
import { TaskService } from 'src/tasks/tasks.service';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ProjectResponseDto } from './dto/response-project.dto';
import { ProjectDeleteResponseDto } from './dto/response-project-delete.dto';

@ApiTags('Projects')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@Controller('projects')
@UseGuards(AuthGuard)
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly taskService: TaskService,
  ) {}

  @ApiOperation({ summary: 'Create a new project' })
  @ApiCreatedResponse({
    description: 'The project has been successfully created',
    type: ProjectResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @HttpCode(201)
  @Post('')
  async create(
    @Body() createProjectDto: CreateProjectDto,
    @Req() request: Request,
  ): Promise<ProjectResponseDto> {
    try {
      const newProject = await this.projectsService.create(
        createProjectDto.name,
        createProjectDto.description,
        request['user'].email,
      );
      return new ProjectResponseDto(
        'Project [' + newProject.name + '] created successfully',
        newProject,
      );
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'Get project by id' })
  @ApiParam({
    name: 'id',
    example: '660451b642509b83c6a0f695',
    description: 'The unique identifier of the project',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    description: 'The project has been successfully retrieved',
    type: Project,
  })
  @ApiNotFoundResponse({ description: 'Project not found' })
  @HttpCode(200)
  @Get(':id')
  async findById(@Req() request: Request): Promise<Project> {
    try {
      const project = await this.projectsService.findById(request.params.id);
      if (!project) {
        throw new NotFoundException();
      }
      return project;
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'Update project by id' })
  @ApiParam({
    name: 'id',
    example: '660451b642509b83c6a0f695',
    description: 'The unique identifier of the project',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    description: 'The project has been successfully updated',
    type: ProjectResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Project not found' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @HttpCode(200)
  @Patch(':id')
  async update(
    @Body() updateProjectDto: UpdateProjectDto,
    @Req() request: Request,
  ): Promise<ProjectResponseDto> {
    try {
      const updatedProject = await this.projectsService.update(
        request.params.id,
        updateProjectDto.name,
        updateProjectDto.description,
      );
      if (!updatedProject) {
        throw new NotFoundException();
      }
      return new ProjectResponseDto(
        'Project [' + updatedProject.name + '] updated successfully',
        updatedProject,
      );
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'Delete project by id' })
  @ApiParam({
    name: 'id',
    example: '660451b642509b83c6a0f695',
    description: 'The unique identifier of the project',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    description: 'The project has been successfully deleted',
    type: ProjectDeleteResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Project not found' })
  @HttpCode(200)
  @Delete(':id')
  async delete(@Req() request: Request): Promise<ProjectDeleteResponseDto> {
    try {
      const tasksUpdated = await this.taskService.removeProjectFromAllTask(
        request.params.id,
      );
      const deletedProject = await this.projectsService.delete(
        request.params.id,
      );
      if (!deletedProject) {
        throw new NotFoundException();
      }
      return new ProjectDeleteResponseDto(
        'Project [' + deletedProject.name + '] deleted successfully',
        deletedProject,
        tasksUpdated,
      );
    } catch (error) {
      throw error;
    }
  }
}
