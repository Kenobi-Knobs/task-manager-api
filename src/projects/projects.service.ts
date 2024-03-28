import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project, ProjectDocument } from './model/project.schema';
import { CreateProjectDto } from './dto/create-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
  ) {}

  async create(
    createProjectDto: CreateProjectDto,
    author: string,
  ): Promise<Project> {
    const newProject = new this.projectModel({
      name: createProjectDto.name,
      description: createProjectDto.description,
      author: author,
    });
    return newProject.save();
  }

  async findById(id: string): Promise<Project> {
    return this.projectModel
      .findById(id)
      .orFail(new NotFoundException(`Project not found`));
  }

  async update(
    id: string,
    updateProjectDto: CreateProjectDto,
  ): Promise<Project> {
    return this.projectModel
      .findByIdAndUpdate(
        id,
        {
          name: updateProjectDto.name,
          description: updateProjectDto.description,
        },
        { new: true },
      )
      .orFail(new NotFoundException(`Project not found`));
  }

  async delete(id: string): Promise<Project> {
    return this.projectModel
      .findByIdAndDelete(id)
      .orFail(new NotFoundException(`Project not found`));
  }
}
