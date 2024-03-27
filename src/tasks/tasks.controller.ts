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
  NotFoundException,
  Delete,
  Query,
} from '@nestjs/common';
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
  @Post('create')
  async create(
    @Body() createTaskDto: CreateTaskDto,
    @Request() req,
  ): Promise<TaskResponseDto> {
    try {
      const userEmail = req.user.email;
      const newTask = await this.taskService.create(
        createTaskDto.name,
        createTaskDto.description,
        userEmail,
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
  async findOne(@Request() req): Promise<Task> {
    try {
      const task = await this.taskService.findOne(req.params.id);
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
    @Request() req,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<TaskResponseDto> {
    try {
      const task = await this.taskService.update(
        req.params.id,
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
  async delete(@Request() req): Promise<TaskResponseDto> {
    try {
      const task = await this.taskService.delete(req.params.id);
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
    @Request() req,
    @Body() promoteTaskDto: PromoteTaskDto,
  ): Promise<TaskResponseDto> {
    try {
      const task = await this.taskService.promote(
        req.params.id,
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
  async addToProject(@Request() req): Promise<TaskResponseDto> {
    try {
      const task = await this.taskService.addToProject(
        req.params.id,
        req.params.projectId,
      );
      if (!task) {
        throw new NotFoundException();
      }
      return new TaskResponseDto(
        'Task [' +
          req.params.id +
          '] added to project [' +
          req.params.projectId +
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
