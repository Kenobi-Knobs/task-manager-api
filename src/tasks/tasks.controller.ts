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

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  @HttpCode(201)
  @Post('create')
  async create(
    @Body() createTaskDto: CreateTaskDto,
    @Request() req,
  ): Promise<{ message: string; task: Task }> {
    try {
      const userEmail = req.user.email;
      const newTask = await this.taskService.create(
        createTaskDto.name,
        createTaskDto.description,
        userEmail,
      );
      return {
        message: 'Task [' + createTaskDto.name + '] created successfully',
        task: newTask,
      };
    } catch (error) {
      throw error;
    }
  }

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

  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  @HttpCode(200)
  @Patch(':id')
  async update(
    @Request() req,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<{ message: string; task: Task }> {
    try {
      const task = await this.taskService.update(
        req.params.id,
        updateTaskDto.name,
        updateTaskDto.description,
      );
      if (!task) {
        throw new NotFoundException();
      }
      return {
        message: 'Task [' + updateTaskDto.name + '] updated successfully',
        task: task,
      };
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(AuthGuard)
  @HttpCode(200)
  @Delete(':id')
  async delete(@Request() req): Promise<{ message: string; task: Task }> {
    try {
      const task = await this.taskService.delete(req.params.id);
      if (!task) {
        throw new NotFoundException();
      }
      return {
        message: 'Task [' + task.name + '] deleted successfully',
        task: task,
      };
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  @HttpCode(200)
  @Patch(':id/promote')
  async promote(
    @Request() req,
    @Body() promoteTaskDto: PromoteTaskDto,
  ): Promise<{ message: string; task: Task }> {
    try {
      const task = await this.taskService.promote(
        req.params.id,
        promoteTaskDto.status,
      );
      if (!task) {
        throw new NotFoundException();
      }
      return {
        message:
          'Task [' + task.name + '] promoted to ' + promoteTaskDto.status,
        task: task,
      };
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(AuthGuard)
  @HttpCode(200)
  @Patch(':id/add-to-project/:projectId')
  async addToProject(@Request() req): Promise<{ message: string; task: Task }> {
    try {
      const task = await this.taskService.addToProject(
        req.params.id,
        req.params.projectId,
      );
      if (!task) {
        throw new NotFoundException();
      }
      return {
        message:
          'Task [' +
          req.params.id +
          '] added to project [' +
          req.params.projectId +
          ']',
        task: task,
      };
    } catch (error) {
      throw error;
    }
  }

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
