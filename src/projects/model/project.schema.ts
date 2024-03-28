import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';
import { HydratedDocument } from 'mongoose';

export type ProjectDocument = HydratedDocument<Project>;

@Schema({ versionKey: false, timestamps: true })
export class Project {
  @ApiProperty({
    example: '660451b642509b83c6a0f695',
    description: 'The unique identifier of the project',
    type: String,
  })
  _id: mongoose.Types.ObjectId;

  @ApiProperty({
    example: 'My project',
    description: 'The name of the project',
    minLength: 3,
    maxLength: 100,
    type: String,
    required: true,
  })
  @Prop()
  name: string;

  @ApiProperty({
    example: 'Some project description text',
    description: 'The description of the project',
    minLength: 3,
    maxLength: 500,
    type: String,
    required: true,
  })
  @Prop()
  description: string;

  @ApiProperty({
    example: 'email@gmail.com',
    description: 'The author of the project email address',
    type: String,
    required: true,
  })
  @Prop()
  author: string;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
