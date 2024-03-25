import { IsString, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { TaskStatus } from './enums/task-status.enum';
import { SortByField } from './enums/sort-by-field.enum';
import { SortDirection } from './enums/sort-direction.enum';

export class GetTasksDto {
  @IsOptional()
  @IsString()
  readonly author: string;

  @IsOptional()
  @IsString()
  @IsEnum(TaskStatus)
  readonly status: string;

  @IsOptional()
  @IsString()
  readonly projectId: string;

  @IsOptional()
  @IsString()
  @IsEnum(SortByField)
  readonly sortBy: string;

  @IsOptional()
  @IsString()
  @IsEnum(SortDirection)
  readonly sortDir: string;

  @IsOptional()
  @IsDateString()
  readonly createdAt: Date;
}
