import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { getModelToken } from '@nestjs/mongoose/dist/common';
import { Project } from './model/project.schema';
import { AuthGuard } from '../auth/auth.guard';
import { JwtService } from '@nestjs/jwt';
import { TaskService } from '../tasks/tasks.service';
import { Task } from '../tasks/model/task.schema';
import { ProjectResponseDto } from './dto/response-project.dto';
import { ProjectDeleteResponseDto } from './dto/response-project-delete.dto';

class MockProjectModel {
  constructor(private data) {}
  save = jest.fn().mockResolvedValue(this.data);
  static updateMany = jest.fn().mockResolvedValue('updated');
}

class MockTaskModel {
  static updateMany = jest.fn().mockResolvedValue('updated');
}

describe('ProjectsController', () => {
  let controller: ProjectsController;
  let service: ProjectsService;
  let taskService: TaskService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectsController],
      providers: [
        ProjectsService,
        AuthGuard,
        JwtService,
        TaskService,
        {
          provide: getModelToken(Task.name),
          useValue: MockTaskModel,
        },
        {
          provide: getModelToken(Project.name),
          useValue: MockProjectModel,
        },
      ],
    }).compile();

    controller = module.get<ProjectsController>(ProjectsController);
    service = module.get<ProjectsService>(ProjectsService);
    taskService = module.get<TaskService>(TaskService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a project', async () => {
      const createProjectDto = {
        name: 'Project 1',
        description: 'Description',
      };
      const author = 'email@gmail.com';

      const newProject = new Project();
      newProject.name = createProjectDto.name;
      newProject.description = createProjectDto.description;
      newProject.author = author;

      jest.spyOn(service, 'create').mockResolvedValue(newProject);

      const result = await controller.create(createProjectDto, {
        user: { email: author },
      });

      expect(service.create).toHaveBeenCalledWith(createProjectDto, author);
      expect(result).toEqual(
        new ProjectResponseDto(
          'Project [' + newProject.name + '] created successfully',
          newProject,
        ),
      );
    });
  });

  describe('findById', () => {
    it('should find a project by id', async () => {
      const projectIdDto = { id: '123' };
      const project = new Project();
      project.name = 'Project 1';
      project.description = 'Description';
      project.author = 'email@gmail.com';

      jest.spyOn(service, 'findById').mockResolvedValue(project);

      const result = await controller.findById(projectIdDto);

      expect(service.findById).toHaveBeenCalledWith(projectIdDto);
      expect(result).toEqual(project);
    });
  });

  describe('update', () => {
    it('should update a project by id', async () => {
      const projectIdDto = { id: '123' };
      const updateProjectDto = {
        name: 'Project 2',
        description: 'Description',
      };
      const project = new Project();
      project.name = 'Project 1';
      project.description = 'Description';
      project.author = 'email@gmail.com';

      jest.spyOn(service, 'update').mockResolvedValue(project);

      const result = await controller.update(updateProjectDto, projectIdDto);

      expect(service.update).toHaveBeenCalledWith(
        projectIdDto,
        updateProjectDto,
      );
      expect(result).toEqual(
        new ProjectResponseDto(
          'Project [' + project.name + '] updated successfully',
          project,
        ),
      );
    });
  });

  describe('delete', () => {
    it('should delete a project by id and remove project in task', async () => {
      const projectIdDto = { id: '123' };
      const project = new Project();
      project.name = 'Project 1';
      project.description = 'Description';
      project.author = 'email@gmail.com';

      jest.spyOn(service, 'delete').mockResolvedValue(project);
      jest.spyOn(taskService, 'removeProjectFromAllTask').mockResolvedValue(1);

      const result = await controller.delete(projectIdDto);

      expect(taskService.removeProjectFromAllTask).toHaveBeenCalledWith(
        projectIdDto,
      );
      expect(service.delete).toHaveBeenCalledWith(projectIdDto);
      expect(result).toEqual(
        new ProjectDeleteResponseDto(
          'Project [' + project.name + '] deleted successfully',
          project,
          1,
        ),
      );
    });
  });
});
