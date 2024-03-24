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
}
