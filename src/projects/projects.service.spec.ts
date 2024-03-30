import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsService } from './projects.service';
import { getModelToken } from '@nestjs/mongoose';
import { Project } from './model/project.schema';
import { NotFoundException } from '@nestjs/common';

const project = {
  name: 'Project name',
  description: 'Project description',
  author: 'Author',
};

class ProjectModel {
  constructor(private data) {}
  save = jest.fn().mockResolvedValue(this.data);
  static findById = jest.fn().mockReturnThis();
  static findByIdAndUpdate = jest.fn().mockReturnThis();
  static findByIdAndDelete = jest.fn().mockReturnThis();
  static orFail = jest.fn();
}

describe('ProjectsService', () => {
  let service: ProjectsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsService,
        { provide: getModelToken(Project.name), useValue: ProjectModel },
      ],
    }).compile();

    service = module.get<ProjectsService>(ProjectsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a project with author', async () => {
      const projectDto = {
        name: 'Project name',
        description: 'Project description',
      };
      const author = 'Author';
      const result = await service.create(projectDto, author);
      expect(result).toEqual({ ...project, author });
    });
  });

  describe('findById', () => {
    it('should find a project by id', async () => {
      const id = 'project-id';

      ProjectModel.orFail.mockReturnValueOnce(project);

      const result = await service.findById({ id });
      expect(ProjectModel.findById).toHaveBeenCalledWith(id);
      expect(result).toEqual(project);
    });

    it('should throw an error if project not found', async () => {
      const id = 'wrong-project-id';

      ProjectModel.orFail.mockRejectedValueOnce(
        new NotFoundException('Not found'),
      );

      await expect(service.findById({ id })).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a project by id', async () => {
      const id = 'project-id';
      const update = {
        name: 'New project name',
        description: 'New project description',
      };

      ProjectModel.orFail.mockReturnValueOnce(update);

      const result = await service.update({ id: id }, update);
      expect(ProjectModel.findByIdAndUpdate).toHaveBeenCalledWith(id, update, {
        new: true,
      });
      expect(result).toEqual(update);
    });

    it('should throw an error if project not found', async () => {
      const id = 'wrong-project-id';
      const update = {
        name: 'New project name',
        description: 'New project description',
      };

      ProjectModel.orFail.mockRejectedValueOnce(
        new NotFoundException('Not found'),
      );

      await expect(service.update({ id: id }, update)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('delete', () => {
    it('should delete a project by id', async () => {
      const id = 'project-id';

      ProjectModel.orFail.mockReturnValueOnce(project);

      const result = await service.delete({ id: id });
      expect(ProjectModel.findByIdAndDelete).toHaveBeenCalledWith(id);
      expect(result).toEqual(project);
    });

    it('should throw an error if project not found', async () => {
      const id = 'wrong-project-id';

      ProjectModel.orFail.mockRejectedValueOnce(
        new NotFoundException('Not found'),
      );

      await expect(service.delete({ id: id })).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });
});
