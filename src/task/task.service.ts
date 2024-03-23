import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Task, TaskDocument } from './model/task.schema';

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
    });
    return newTask.save();
  }

  async findOne(id: string): Promise<Task> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }
    return this.taskModel.findById(id).exec();
  }
}
