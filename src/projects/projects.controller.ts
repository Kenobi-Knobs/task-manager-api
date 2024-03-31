import {
  Controller,
  Post,
  Body,
  HttpCode,
  UseGuards,
  Get,
  Patch,
  Delete,
  Req,
  Param,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './model/project.schema';
import { AuthGuard } from '../auth/auth.guard';
import { TaskService } from '../tasks/tasks.service';
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
import { ProjectIdDto } from './dto/project-id.dto';

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
    @Req() request,
  ): Promise<ProjectResponseDto> {
    const newProject = await this.projectsService.create(
      createProjectDto,
      request['user'].email,
    );
    return new ProjectResponseDto(
      'Project [' + newProject.name + '] created successfully',
      newProject,
    );
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
  async findById(@Param() params: ProjectIdDto): Promise<Project> {
    const project = await this.projectsService.findById(params);
    return project;
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
    @Param() params: ProjectIdDto,
  ): Promise<ProjectResponseDto> {
    const updatedProject = await this.projectsService.update(
      params,
      updateProjectDto,
    );
    return new ProjectResponseDto(
      'Project [' + updatedProject.name + '] updated successfully',
      updatedProject,
    );
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
  async delete(
    @Param() params: ProjectIdDto,
  ): Promise<ProjectDeleteResponseDto> {
    const tasksUpdated =
      await this.taskService.removeProjectFromAllTask(params);
    const deletedProject = await this.projectsService.delete(params);
    return new ProjectDeleteResponseDto(
      'Project [' + deletedProject.name + '] deleted successfully',
      deletedProject,
      tasksUpdated,
    );
  }
}
