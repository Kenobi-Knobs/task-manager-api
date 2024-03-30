import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './tasks.service';
import { getModelToken } from '@nestjs/mongoose';
import { Task } from './model/task.schema';
import { NotFoundException } from '@nestjs/common';
import { TaskStatus } from './dto/enums/task-status.enum';
import { GetTasksDto } from './dto/get-tasks.dto';

const task = {
  name: 'Task title',
  description: 'Task description',
  author: 'Author',
  projectId: null,
  status: 'New',
};

class TaskModel {
  constructor(private data) {}
  save = jest.fn().mockResolvedValue(this.data);
  static findById = jest.fn().mockReturnThis();
  static findByIdAndUpdate = jest.fn().mockReturnThis();
  static findByIdAndDelete = jest.fn().mockReturnThis();
  static updateMany = jest.fn().mockReturnThis();
  static find = jest.fn().mockReturnThis();
  static sort = jest.fn().mockReturnThis();
  static exec = jest.fn();
  static orFail = jest.fn();
}

describe('TaskService', () => {
  let service: TaskService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        { provide: getModelToken(Task.name), useValue: TaskModel },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a task with author, state, projectId', async () => {
      const taskDto = {
        name: 'Task title',
        description: 'Task description',
      };
      const author = 'Author';

      const result = await service.create(taskDto, author);
      expect(result).toEqual(task);
    });
  });

  describe('findOne', () => {
    it('should find a task by id', async () => {
      const id = 'task-id';

      TaskModel.orFail.mockReturnValueOnce(task);

      const result = await service.findOne({ id: id });
      expect(TaskModel.findById).toHaveBeenCalledWith(id);
      expect(result).toEqual(task);
    });

    it('should throw an error if task not found', async () => {
      const id = 'task-id';

      TaskModel.orFail.mockRejectedValueOnce(
        new NotFoundException('Task not found'),
      );

      await expect(service.findOne({ id: id })).rejects.toThrow(
        new NotFoundException('Task not found'),
      );
    });
  });

  describe('update', () => {
    it('should update a task by id', async () => {
      const id = 'task-id';
      const update = {
        name: 'Task title',
        description: 'Task description',
      };

      TaskModel.orFail.mockReturnValueOnce(update);

      const result = await service.update({ id: id }, update);
      expect(TaskModel.findByIdAndUpdate).toHaveBeenCalledWith(id, update, {
        new: true,
      });
      expect(result).toEqual(update);
    });

    it('should throw an error if task not found', async () => {
      const id = 'task-id';
      const update = {
        name: 'Task title',
        description: 'Task description',
      };

      TaskModel.orFail.mockRejectedValueOnce(
        new NotFoundException('Task not found'),
      );

      await expect(service.update({ id: id }, update)).rejects.toThrow(
        new NotFoundException('Task not found'),
      );
    });

    describe('delete', () => {
      it('should delete a task by id', async () => {
        const id = 'task-id';

        TaskModel.orFail.mockReturnValueOnce(task);

        const result = await service.delete({ id: id });
        expect(TaskModel.findByIdAndDelete).toHaveBeenCalledWith(id);
        expect(result).toEqual(task);
      });

      it('should throw an error if task not found', async () => {
        const id = 'task-id';

        TaskModel.orFail.mockRejectedValueOnce(
          new NotFoundException('Task not found'),
        );

        await expect(service.delete({ id: id })).rejects.toThrow(
          new NotFoundException('Task not found'),
        );
      });
    });

    describe('promote', () => {
      it('should promote a task by id', async () => {
        const id = 'task-id';
        const promote = {
          status: TaskStatus.InProgress,
        };
        const updatedTask = {
          ...task,
          status: TaskStatus.InProgress,
        };

        TaskModel.orFail.mockReturnValueOnce(updatedTask);

        const result = await service.promote({ id: id }, promote);
        expect(TaskModel.findByIdAndUpdate).toHaveBeenCalledWith(id, promote, {
          new: true,
        });
        expect(result).toEqual(updatedTask);
      });

      it('should throw an error if task not found', async () => {
        const id = 'task-id';
        const promote = {
          status: TaskStatus.InProgress,
        };

        TaskModel.orFail.mockRejectedValueOnce(
          new NotFoundException('Task not found'),
        );

        await expect(service.promote({ id: id }, promote)).rejects.toThrow(
          new NotFoundException('Task not found'),
        );
      });
    });

    describe('addToProject', () => {
      it('should add a project to a task', async () => {
        const addProjectDto = {
          id: 'task-id',
          projectId: 'project-id',
        };

        const updatedTask = {
          ...task,
          projectId: addProjectDto.projectId,
        };

        TaskModel.orFail.mockReturnValueOnce(updatedTask);

        const result = await service.addToProject(addProjectDto);
        expect(TaskModel.findByIdAndUpdate).toHaveBeenCalledWith(
          addProjectDto.id,
          { projectId: addProjectDto.projectId },
          { new: true },
        );
        expect(result).toEqual(updatedTask);
      });

      it('should throw an error if task not found', async () => {
        const addProjectDto = {
          id: 'task-id',
          projectId: 'project-id',
        };

        TaskModel.orFail.mockRejectedValueOnce(
          new NotFoundException('Task or Project not found'),
        );

        await expect(service.addToProject(addProjectDto)).rejects.toThrow(
          new NotFoundException('Task or Project not found'),
        );
      });
    });

    describe('removeProjectFromAllTask', () => {
      it('should remove project from all tasks', async () => {
        const projectIdDto = {
          id: 'project-id',
        };
        const updatedTaskCount = 1;

        TaskModel.updateMany.mockResolvedValueOnce({
          modifiedCount: updatedTaskCount,
        });

        const result = await service.removeProjectFromAllTask(projectIdDto);
        expect(TaskModel.updateMany).toHaveBeenCalledWith(
          { projectId: projectIdDto.id },
          { projectId: null },
        );

        expect(result).toEqual(updatedTaskCount);
      });

      it('should throw an error if project not found', async () => {
        const projectIdDto = {
          id: 'project-id',
        };

        TaskModel.updateMany.mockRejectedValueOnce(
          new NotFoundException('Project not found'),
        );

        await expect(
          service.removeProjectFromAllTask(projectIdDto),
        ).rejects.toThrow(new NotFoundException('Project not found'));
      });
    });

    describe('findAll', () => {
      it('should find all tasks with filter and sort asc', async () => {
        const dtoFilter: GetTasksDto = {
          author: 'John Doe',
          status: 'In Progress',
          projectId: 'project-id',
          sortBy: 'createdAt',
          sortDir: 'asc',
          createdAt: new Date(),
        };

        const result = [task, task, task];
        const findFilter = {
          author: dtoFilter.author,
          status: dtoFilter.status,
          projectId: dtoFilter.projectId,
          createdAt: dtoFilter.createdAt,
        };
        const sort = {
          createdAt: 1,
        };

        TaskModel.exec.mockResolvedValueOnce(result);

        const tasks = await service.findAll(dtoFilter);
        expect(TaskModel.find).toHaveBeenCalledWith(findFilter);
        expect(TaskModel.sort).toHaveBeenCalledWith(sort);
        expect(tasks).toEqual(result);
      });

      it('should find all tasks with filter and sort desc', async () => {
        const dtoFilter: GetTasksDto = {
          author: 'John Doe',
          status: 'In Progress',
          projectId: 'project-id',
          sortBy: 'createdAt',
          sortDir: 'desc',
          createdAt: new Date(),
        };

        const result = [task, task, task];
        const findFilter = {
          author: dtoFilter.author,
          status: dtoFilter.status,
          projectId: dtoFilter.projectId,
          createdAt: dtoFilter.createdAt,
        };
        const sort = {
          createdAt: -1,
        };

        TaskModel.exec.mockResolvedValueOnce(result);

        const tasks = await service.findAll(dtoFilter);
        expect(TaskModel.find).toHaveBeenCalledWith(findFilter);
        expect(TaskModel.sort).toHaveBeenCalledWith(sort);
        expect(tasks).toEqual(result);
      });
    });
  });
});
