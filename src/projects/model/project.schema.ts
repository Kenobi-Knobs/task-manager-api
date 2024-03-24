import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { HydratedDocument } from 'mongoose';

export type ProjectDocument = HydratedDocument<Project>;

@Schema()
export class Project {
  _id: mongoose.Types.ObjectId;

  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  author: string;

  @Prop()
  createdAt: Date;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
