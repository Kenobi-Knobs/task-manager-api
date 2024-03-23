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
  NotFoundException,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './model/task.schema';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @UseGuards(AuthGuard)
  @Post('create')
  @HttpCode(201)
  @UsePipes(ValidationPipe)
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
}
