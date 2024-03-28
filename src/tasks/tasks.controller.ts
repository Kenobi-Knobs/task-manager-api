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
    const newTask = await this.taskService.create(
      createTaskDto,
      request['user'].email,
    );
    return new TaskResponseDto(
      'Task [' + newTask.name + '] created successfully',
      newTask,
    );
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
    const task = await this.taskService.findOne(params);
    return task;
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
    const task = await this.taskService.update(params, updateTaskDto);
    return new TaskResponseDto(
      'Task [' + task.name + '] updated successfully',
      task,
    );
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
    const task = await this.taskService.delete(params);
    return new TaskResponseDto(
      'Task [' + task.name + '] deleted successfully',
      task,
    );
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
    const task = await this.taskService.promote(params, promoteTaskDto);
    return new TaskResponseDto(
      'Task [' + task.name + '] promoted to [' + promoteTaskDto.status + ']',
      task,
    );
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
    const task = await this.taskService.addToProject(params);
    return new TaskResponseDto(
      'Task [' + params.id + '] added to project [' + params.projectId + ']',
      task,
    );
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
    const tasks = await this.taskService.findAll(getTasksDto);
    return tasks;
  }
}
