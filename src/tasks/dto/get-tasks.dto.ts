import { IsString, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { TaskStatus } from './enums/task-status.enum';
import { SortByField } from './enums/sort-by-field.enum';
import { SortDirection } from './enums/sort-direction.enum';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetTasksDto {
  @ApiPropertyOptional({
    example: 'email@gmail.com',
    description: 'The author of the task email address',
    type: String,
  })
  @IsOptional()
  @IsString()
  readonly author: string;

  @ApiPropertyOptional({
    example: 'New',
    description: 'The status of the task',
    type: String,
    enum: TaskStatus,
  })
  @IsOptional()
  @IsString()
  @IsEnum(TaskStatus)
  readonly status: string;

  @ApiPropertyOptional({
    example: '660451b642509b83c6a0f695',
    description: 'The unique identifier of the project',
    type: String,
  })
  @IsOptional()
  @IsString()
  readonly projectId: string;

  @ApiPropertyOptional({
    example: 'createdAt',
    description: 'The field to sort the task',
    type: String,
    enum: SortByField,
  })
  @IsOptional()
  @IsString()
  @IsEnum(SortByField)
  readonly sortBy: string;

  @ApiPropertyOptional({
    example: 'asc',
    description: 'The sort direction of the task',
    type: String,
    enum: SortDirection,
  })
  @IsOptional()
  @IsString()
  @IsEnum(SortDirection)
  readonly sortDir: string;

  @ApiPropertyOptional({
    example: '2021-01-01T00:00:00.000Z',
    description: 'The creation date of the task',
    type: Date,
  })
  @IsOptional()
  @IsDateString()
  readonly createdAt: Date;
}
