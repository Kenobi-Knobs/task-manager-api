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
import { AuthGuard } from 'src/auth/auth.guard';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';

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
  ): Promise<any> {
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
}
