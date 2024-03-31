import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './tasks.controller';
import { Task } from './model/task.schema';
import { TaskService } from './tasks.service';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { TaskStatus } from './dto/enums/task-status.enum';
import { TaskResponseDto } from './dto/response-task.dto';
import { ObjectId } from 'mongodb';

class MockTaskModel {
  constructor(private data) {}
  save = jest.fn().mockResolvedValue(this.data);
}

describe('TaskController', () => {
  let controller: TaskController;
  let service: TaskService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        TaskService,
        JwtService,
        {
          provide: getModelToken(Task.name),
          useValue: MockTaskModel,
        },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
    controller = module.get<TaskController>(TaskController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a task', async () => {
      const createTaskDto = {
        name: 'Task 1',
        description: 'Description',
        projectId: '1',
      };
      const author = 'email@gmail.com';

      const newTask = new Task();
      newTask.name = createTaskDto.name;
      newTask.description = createTaskDto.description;
      newTask.projectId = null;
      newTask.author = author;
      newTask.status = TaskStatus.New;

      jest.spyOn(service, 'create').mockResolvedValue(newTask);

      const result = await controller.create(createTaskDto, {
        user: { email: author },
      });

      expect(service.create).toHaveBeenCalledWith(createTaskDto, author);
      expect(result).toEqual(
        new TaskResponseDto(
          'Task [' + newTask.name + '] created successfully',
          newTask,
        ),
      );
    });
  });

  describe('findOne', () => {
    it('should find a task by id', async () => {
      const taskId = '1';
      const task = new Task();
      task.name = 'Task 1';
      task.description = 'Description';
      task.projectId = null;
      task.author = 'email@gmail.com';
      task.status = TaskStatus.New;

      jest.spyOn(service, 'findOne').mockResolvedValue(task);

      const result = await controller.findOne({ id: taskId });

      expect(service.findOne).toHaveBeenCalledWith({ id: taskId });
      expect(result).toEqual(task);
    });
  });

  describe('update', () => {
    it('should update a task by id', async () => {
      const taskId = '1';
      const updateTaskDto = {
        name: 'Task 2',
        description: 'Description',
        projectId: '1',
      };
      const task = new Task();
      task.name = 'Task 1';
      task.description = 'Description';
      task.projectId = null;
      task.author = 'email@gmail.com';
      task.status = TaskStatus.New;

      jest.spyOn(service, 'update').mockResolvedValue(task);

      const result = await controller.update({ id: taskId }, updateTaskDto);

      expect(service.update).toHaveBeenCalledWith(
        { id: taskId },
        updateTaskDto,
      );
      expect(result).toEqual(
        new TaskResponseDto(
          'Task [' + task.name + '] updated successfully',
          task,
        ),
      );
    });
  });

  describe('delete', () => {
    it('should delete a task by id', async () => {
      const taskId = '1';
      const task = new Task();
      task.name = 'Task 1';
      task.description = 'Description';
      task.projectId = null;
      task.author = 'email@gmail.com';
      task.status = TaskStatus.New;

      jest.spyOn(service, 'delete').mockResolvedValue(task);

      const result = await controller.delete({ id: taskId });

      expect(service.delete).toHaveBeenCalledWith({ id: taskId });
      expect(result).toEqual(
        new TaskResponseDto(
          'Task [' + task.name + '] deleted successfully',
          task,
        ),
      );
    });
  });

  describe('promote', () => {
    it('should promote a task by id', async () => {
      const taskId = '1';
      const promoteTaskDto = {
        status: TaskStatus.InProgress,
      };
      const task = new Task();
      task.name = 'Task 1';
      task.description = 'Description';
      task.projectId = null;
      task.author = 'email@gmail.com';
      task.status = promoteTaskDto.status;

      jest.spyOn(service, 'promote').mockResolvedValue(task);

      const result = await controller.promote({ id: taskId }, promoteTaskDto);

      expect(service.promote).toHaveBeenCalledWith(
        { id: taskId },
        promoteTaskDto,
      );
      expect(result).toEqual(
        new TaskResponseDto(
          'Task [' +
            task.name +
            '] promoted to [' +
            promoteTaskDto.status +
            ']',
          task,
        ),
      );
      expect(result.task.status).toEqual(promoteTaskDto.status);
    });
  });

  describe('addTaskToProject', () => {
    it('should add a project to a task', async () => {
      const taskId = '1';
      const projectId = '6609671bdb5925f969a3cc2d';
      const task = new Task();
      task.name = 'Task 1';
      task.description = 'Description';
      task.projectId = new ObjectId(projectId);
      task.author = 'email@gmail.com';
      task.status = TaskStatus.New;

      jest.spyOn(service, 'addToProject').mockResolvedValue(task);

      const result = await controller.addToProject({
        id: taskId,
        projectId: projectId,
      });

      expect(service.addToProject).toHaveBeenCalledWith({
        id: taskId,
        projectId: projectId,
      });
      expect(result).toEqual(
        new TaskResponseDto(
          'Task [' + taskId + '] added to project [' + projectId + ']',
          task,
        ),
      );
      expect(result.task.projectId).toEqual(new ObjectId(projectId));
    });
  });

  describe('find all tasks by filter', () => {
    it('should return all tasks by filter', async () => {
      const tasks = [
        {
          _id: new ObjectId('6609671bdb5925f969a3cc2d'),
          name: 'Task 1',
          description: 'Description',
          projectId: null,
          author: 'email@gmail.com',
          status: TaskStatus.New,
        },
        {
          _id: new ObjectId('6609671bdb5925f969a3cc2c'),
          name: 'Task 2',
          description: 'Description',
          projectId: null,
          author: 'email@gmail.com',
          status: TaskStatus.New,
        },
      ];

      const filter = {
        author: 'email@gmail.com',
        status: TaskStatus.New,
        projectId: null,
        createdAt: null,
        sortBy: 'name',
        sortDir: 'asc',
      };

      jest.spyOn(service, 'findAll').mockResolvedValue(tasks);

      const result = await controller.findAll(filter);

      expect(service.findAll).toHaveBeenCalledWith(filter);
      expect(result).toEqual(tasks);
    });
  });
});
