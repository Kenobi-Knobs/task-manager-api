import {
  Controller,
  Post,
  Body,
  HttpCode,
  Req,
  UseGuards,
  Get,
  Patch,
  Delete,
  Query,
  Param,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';
import { TaskService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PromoteTaskDto } from './dto/promote-task.dto';
import { Task } from './model/task.schema';
import { GetTasksDto } from './dto/get-tasks.dto';
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
import { TaskResponseDto } from './dto/response-task.dto';
import { TaskIdDto } from './dto/task-id.dto';
import { AddToProjectDto } from './dto/add-to-project.dto';

@ApiTags('Tasks')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@Controller('tasks')
@UseGuards(AuthGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @ApiOperation({ summary: 'Create a new task' })
  @ApiCreatedResponse({
    description: 'The task has been successfully created',
    type: TaskResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @HttpCode(201)
  @Post('')
  async create(
    @Body() createTaskDto: CreateTaskDto,
    @Req() request: Request,
  ): Promise<TaskResponseDto> {
    try {
      const newTask = await this.taskService.create(
        createTaskDto.name,
        createTaskDto.description,
        request['user'].email,
      );

      return new TaskResponseDto(
        'Task [' + newTask.name + '] created successfully',
        newTask,
      );
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'Get task by Id' })
  @ApiParam({
    name: 'id',
    example: '660451b642509b83c6a0f695',
    description: 'The unique identifier of the task',
    type: String,
  })
  @ApiOkResponse({
    description: 'The task has been successfully found',
    type: Task,
  })
  @ApiNotFoundResponse({ description: 'Not found' })
  @HttpCode(200)
  @Get(':id')
  async findOne(@Param() params: TaskIdDto): Promise<Task> {
    try {
      const task = await this.taskService.findOne(params.id);
      return task;
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'Update task by Id' })
  @ApiParam({
    name: 'id',
    example: '660451b642509b83c6a0f695',
    description: 'The unique identifier of the task',
    type: String,
  })
  @ApiOkResponse({
    description:
      'The task has been successfully updated and return updated task',
    type: TaskResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @HttpCode(200)
  @Patch(':id')
  async update(
    @Param() params: TaskIdDto,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<TaskResponseDto> {
    try {
      const task = await this.taskService.update(
        params.id,
        updateTaskDto.name,
        updateTaskDto.description,
      );
      return new TaskResponseDto(
        'Task [' + task.name + '] updated successfully',
        task,
      );
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'Delete task by Id' })
  @ApiParam({
    name: 'id',
    example: '660451b642509b83c6a0f695',
    description: 'The unique identifier of the task',
    type: String,
  })
  @ApiOkResponse({
    description: 'The task has been successfully deleted, return deleted task',
    type: TaskResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Not found' })
  @HttpCode(200)
  @Delete(':id')
  async delete(@Param() params: TaskIdDto): Promise<TaskResponseDto> {
    try {
      const task = await this.taskService.delete(params.id);
      return new TaskResponseDto(
        'Task [' + task.name + '] deleted successfully',
        task,
      );
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'Promote task by Id' })
  @ApiParam({
    name: 'id',
    example: '660451b642509b83c6a0f695',
    description: 'The unique identifier of the task',
    type: String,
  })
  @ApiOkResponse({
    description:
      'The task has been successfully promoted and return promoted task',
    type: TaskResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @HttpCode(200)
  @Patch(':id/promote')
  async promote(
    @Param() params: TaskIdDto,
    @Body() promoteTaskDto: PromoteTaskDto,
  ): Promise<TaskResponseDto> {
    try {
      const task = await this.taskService.promote(
        params.id,
        promoteTaskDto.status,
      );
      return new TaskResponseDto(
        'Task [' + task.name + '] promoted to [' + promoteTaskDto.status + ']',
        task,
      );
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'Add task to project' })
  @ApiParam({
    name: 'id',
    example: '660451b642509b83c6a0f695',
    description: 'The unique identifier of the task',
    type: String,
  })
  @ApiParam({
    name: 'projectId',
    example: '660451b642509b83c6a0f695',
    description: 'The unique identifier of the project',
    type: String,
  })
  @ApiOkResponse({
    description:
      'The task has been successfully added to project and return updated task',
    type: TaskResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Not found' })
  @HttpCode(200)
  @Patch(':id/add-to-project/:projectId')
  async addToProject(
    @Param() params: AddToProjectDto,
  ): Promise<TaskResponseDto> {
    try {
      const task = await this.taskService.addToProject(
        params.id,
        params.projectId,
      );
      return new TaskResponseDto(
        'Task [' + params.id + '] added to project [' + params.projectId + ']',
        task,
      );
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'Get task list with params' })
  @ApiOkResponse({
    description: 'Task list returned successfully',
    type: Task,
    isArray: true,
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @HttpCode(200)
  @Get()
  async findAll(@Query() getTasksDto: GetTasksDto): Promise<Task[]> {
    try {
      const tasks = await this.taskService.findAll(getTasksDto);
      return tasks;
    } catch (error) {
      throw error;
    }
  }
}
