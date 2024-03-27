import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';
import { HydratedDocument } from 'mongoose';

export type TaskDocument = HydratedDocument<Task>;

@Schema({ versionKey: false })
export class Task {
  @ApiProperty({
    example: '660451b642509b83c6a0f695',
    description: 'The unique identifier of the task',
    type: String,
  })
  _id: mongoose.Types.ObjectId;

  @ApiProperty({
    example: 'Do anything',
    description: 'The name of the task',
    minLength: 3,
    maxLength: 100,
    type: String,
    required: true,
  })
  @Prop()
  name: string;

  @ApiProperty({
    example: 'Some task description text',
    description: 'The description of the task',
    minLength: 3,
    maxLength: 500,
    type: String,
    required: true,
  })
  @Prop()
  description: string;

  @ApiProperty({
    example: 'author@gmail.com',
    description: 'The author of the task email address',
    type: String,
    required: true,
  })
  @Prop()
  author: string;

  @ApiProperty({
    example: 'New',
    description: 'The status of the task',
    minLength: 3,
    maxLength: 100,
    type: String,
    required: true,
    enum: ['New', 'In Progress', 'Done'],
  })
  @Prop()
  status: string;

  @ApiProperty({
    example: '2021-09-01T00:00:00.000Z',
    description: 'The date and time the task was created',
    type: Date,
    required: true,
  })
  @Prop()
  createdAt: Date;

  @ApiProperty({
    example: '660451b642509b83c6a0f695',
    description: 'The unique identifier of the project',
    default: null,
    type: String,
  })
  @Prop()
  projectId: mongoose.Types.ObjectId;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
