import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task, TaskDocument } from './model/task.schema';
import { GetTasksDto } from './dto/get-tasks.dto';
import { FilterQuery } from 'mongoose';
import { TaskStatus } from './dto/enums/task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PromoteTaskDto } from './dto/promote-task.dto';
import { TaskIdDto } from './dto/task-id.dto';
import { AddToProjectDto } from './dto/add-to-project.dto';
import { ProjectIdDto } from 'src/projects/dto/project-id.dto';

@Injectable()
export class TaskService {
  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {}

  async create(createTaskDto: CreateTaskDto, author: string): Promise<Task> {
    const newTask = new this.taskModel({
      name: createTaskDto.name,
      description: createTaskDto.description,
      author: author,
      status: TaskStatus.New,
      projectId: null,
    });
    return newTask.save();
  }

  async findOne(taskIdDto: TaskIdDto): Promise<Task> {
    return this.taskModel
      .findById(taskIdDto)
      .orFail(new NotFoundException('Task not found'));
  }

  async update(
    taskIdDto: TaskIdDto,
    updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    return this.taskModel
      .findByIdAndUpdate(
        taskIdDto.id,
        { name: updateTaskDto.name, description: updateTaskDto.description },
        { new: true },
      )
      .orFail(new NotFoundException('Task not found'));
  }

  async delete(taskIdDto: TaskIdDto): Promise<Task> {
    return this.taskModel
      .findByIdAndDelete(taskIdDto.id)
      .orFail(new NotFoundException('Task not found'));
  }

  async promote(
    taskIdDto: TaskIdDto,
    promoteTaskDto: PromoteTaskDto,
  ): Promise<Task> {
    return this.taskModel
      .findByIdAndUpdate(
        taskIdDto.id,
        { status: promoteTaskDto.status },
        { new: true },
      )
      .orFail(new NotFoundException('Task not found'));
  }

  async addToProject(addToProjectDto: AddToProjectDto): Promise<Task> {
    return this.taskModel
      .findByIdAndUpdate(
        addToProjectDto.id,
        { projectId: addToProjectDto.projectId },
        { new: true },
      )
      .orFail(new NotFoundException('Task or Project not found'));
  }

  async removeProjectFromAllTask(projectIdDto: ProjectIdDto): Promise<number> {
    const result = await this.taskModel.updateMany(
      {
        projectId: projectIdDto.id,
      },
      { projectId: null },
    );

    return result.modifiedCount;
  }

  async findAll(filter: GetTasksDto): Promise<Task[]> {
    const findFilter: FilterQuery<TaskDocument> = {};
    if (filter.author) findFilter.author = filter.author;
    if (filter.status) findFilter.status = filter.status;
    if (filter.projectId) findFilter.projectId = filter.projectId;
    if (filter.createdAt) findFilter.createdAt = filter.createdAt;

    const sort: any = {};
    if (filter.sortBy) {
      sort[filter.sortBy] = filter.sortDir === 'asc' ? 1 : -1;
    }

    return this.taskModel.find(findFilter).sort(sort).exec();
  }
}
