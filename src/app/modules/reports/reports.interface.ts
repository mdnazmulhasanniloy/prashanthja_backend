import { Model, ObjectId } from 'mongoose';

export interface IReports {
  user: ObjectId;
  event: ObjectId;
  message: string;
}

export type IReportsModules = Model<IReports, Record<string, unknown>>;
