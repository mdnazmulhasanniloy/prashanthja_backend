import { Model, ObjectId } from 'mongoose';
import { ILocation } from '../user/user.interface';

interface IImages {
  key: {
    type: String;
    required: true;
  };
  url: {
    type: String;
    required: true;
  };
}

export interface IEvents {
  images: IImages[];
  user: ObjectId;
  joinedUsers?: ObjectId[];
  title: string;
  description: string;
  date: Date;
  location: ILocation;
  isDeleted: boolean;
}

export type IEventsModules = Model<IEvents, Record<string, unknown>>;
