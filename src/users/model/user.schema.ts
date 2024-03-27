import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ versionKey: false })
export class User {
  @ApiProperty({
    example: '660451b642509b83c6a0f695',
    description: 'The unique identifier of the user',
    type: String,
  })
  _id: mongoose.Types.ObjectId;

  @ApiProperty({
    example: 'John Doe',
    description: 'The name of the user',
    minLength: 3,
    maxLength: 50,
    type: String,
    required: true,
  })
  @Prop()
  name: string;

  @ApiProperty({
    example: 'email@gmail.com',
    description: 'The email of the user',
    type: String,
    required: true,
  })
  @Prop({ unique: true })
  email: string;

  @ApiProperty({
    example: 'password',
    description: 'The password of the user',
    minLength: 6,
    maxLength: 50,
    type: String,
    required: true,
  })
  @Prop()
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
