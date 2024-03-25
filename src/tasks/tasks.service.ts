import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Task, TaskDocument } from './model/task.schema';
import { GetTasksDto } from './dto/get-tasks.dto';

@Injectable()
export class TaskService {
  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {}

  async create(
    name: string,
    description: string,
    author: string,
  ): Promise<Task> {
    const newTask = new this.taskModel({
      name: name,
      description: description,
      author: author,
      status: 'New',
      createdAt: new Date(),
      projectId: null,
    });
    return newTask.save();
  }

  async findOne(id: string): Promise<Task> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }
    return this.taskModel.findById(id).exec();
  }

  async update(id: string, name: string, description: string): Promise<Task> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }
    return this.taskModel.findByIdAndUpdate(
      id,
      { name: name, description: description },
      { new: true },
    );
  }

  async delete(id: string): Promise<Task> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }
    return this.taskModel.findByIdAndDelete(id);
  }

  async promote(id: string, status: string): Promise<Task> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }
    return this.taskModel.findByIdAndUpdate(
      id,
      { status: status },
      { new: true },
    );
  }

  async addToProject(id: string, projectId: string): Promise<Task> {
    if (
      !mongoose.Types.ObjectId.isValid(id) ||
      !mongoose.Types.ObjectId.isValid(projectId)
    ) {
      return null;
    }
    return this.taskModel.findByIdAndUpdate(
      id,
      { projectId: projectId },
      { new: true },
    );
  }

  async removeProjectFromAllTask(projectId: string): Promise<number> {
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return null;
    }
    const result = await this.taskModel.updateMany(
      {
        projectId: projectId,
      },
      { projectId: null },
    );

    return result.modifiedCount;
  }

  async findAll(filter: GetTasksDto): Promise<Task[]> {
    const findFilter: any = {};
    if (filter.author) {
      findFilter.author = filter.author;
    }
    if (filter.status) {
      findFilter.status = filter.status;
    }
    if (filter.projectId) {
      findFilter.projectId = filter.projectId;
    }
    if (filter.createdAt) {
      findFilter.createdAt = filter.createdAt;
    }

    const sort: any = {};
    if (filter.sortBy) {
      sort[filter.sortBy] = filter.sortDir === 'asc' ? 1 : -1;
    }

    return this.taskModel.find(findFilter).sort(sort).exec();
  }
}
