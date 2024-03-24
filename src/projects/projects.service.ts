import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project } from './model/project.schema';

@Injectable()
export class ProjectsService {
  constructor(@InjectModel('Project') private projectModel: Model<any>) {}

  async create(
    name: string,
    description: string,
    author: string,
  ): Promise<Project> {
    const newProject = new this.projectModel({
      name: name,
      description: description,
      author: author,
      createdAt: new Date(),
    });
    return newProject.save();
  }

  async findById(id: string): Promise<Project> {
    return this.projectModel.findById(id);
  }

  async update(
    id: string,
    name: string,
    description: string,
  ): Promise<Project> {
    return this.projectModel.findByIdAndUpdate(
      id,
      { name: name, description: description },
      { new: true },
    );
  }

  async delete(id: string): Promise<Project> {
    return this.projectModel.findByIdAndDelete(id);
  }
}
