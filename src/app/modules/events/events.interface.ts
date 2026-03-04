import { Model, ObjectId } from 'mongoose';
import { ILocation } from '../user/user.interface';

export interface IEvents {
  images: string[];
  author: ObjectId;
  joinedUsers?: ObjectId[];
  title: string;
  description: string;
  date: Date;
  location: ILocation;
  isDeleted: boolean;
}

export type IEventsModules = Model<IEvents, Record<string, unknown>>;
