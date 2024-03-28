import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project, ProjectDocument } from './model/project.schema';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectIdDto } from './dto/project-id.dto';

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

  async findById(projectIdDto: ProjectIdDto): Promise<Project> {
    return this.projectModel
      .findById(projectIdDto.id)
      .orFail(new NotFoundException(`Project not found`));
  }

  async update(
    projectIdDto: ProjectIdDto,
    updateProjectDto: CreateProjectDto,
  ): Promise<Project> {
    return this.projectModel
      .findByIdAndUpdate(
        projectIdDto.id,
        {
          name: updateProjectDto.name,
          description: updateProjectDto.description,
        },
        { new: true },
      )
      .orFail(new NotFoundException(`Project not found`));
  }

  async delete(projectIdDto: ProjectIdDto): Promise<Project> {
    return this.projectModel
      .findByIdAndDelete(projectIdDto.id)
      .orFail(new NotFoundException(`Project not found`));
  }
}
