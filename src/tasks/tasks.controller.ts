import {
  Controller,
  Post,
  Body,
  HttpCode,
  UsePipes,
  ValidationPipe,
  Req,
  UseGuards,
  Get,
  Patch,
  NotFoundException,
  Delete,
  Query,
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

@ApiTags('Tasks')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @ApiOperation({ summary: 'Create a new task' })
  @ApiCreatedResponse({
    description: 'The task has been successfully created',
    type: TaskResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
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
  @UseGuards(AuthGuard)
  @HttpCode(200)
  @Get(':id')
  async findOne(@Req() request: Request): Promise<Task> {
    try {
      const task = await this.taskService.findOne(request.params.id);
      if (!task) {
        throw new NotFoundException();
      }
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
  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  @HttpCode(200)
  @Patch(':id')
  async update(
    @Req() request: Request,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<TaskResponseDto> {
    try {
      const task = await this.taskService.update(
        request.params.id,
        updateTaskDto.name,
        updateTaskDto.description,
      );
      if (!task) {
        throw new NotFoundException();
      }
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
  @UseGuards(AuthGuard)
  @HttpCode(200)
  @Delete(':id')
  async delete(@Req() request: Request): Promise<TaskResponseDto> {
    try {
      const task = await this.taskService.delete(request.params.id);
      if (!task) {
        throw new NotFoundException();
      }
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
  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  @HttpCode(200)
  @Patch(':id/promote')
  async promote(
    @Req() request: Request,
    @Body() promoteTaskDto: PromoteTaskDto,
  ): Promise<TaskResponseDto> {
    try {
      const task = await this.taskService.promote(
        request.params.id,
        promoteTaskDto.status,
      );
      if (!task) {
        throw new NotFoundException();
      }
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
  @UseGuards(AuthGuard)
  @HttpCode(200)
  @Patch(':id/add-to-project/:projectId')
  async addToProject(@Req() request: Request): Promise<TaskResponseDto> {
    try {
      const task = await this.taskService.addToProject(
        request.params.id,
        request.params.projectId,
      );
      if (!task) {
        throw new NotFoundException();
      }
      return new TaskResponseDto(
        'Task [' +
          request.params.id +
          '] added to project [' +
          request.params.projectId +
          ']',
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
  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
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
