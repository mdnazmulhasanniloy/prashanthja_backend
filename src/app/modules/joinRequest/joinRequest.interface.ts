import { Model, ObjectId } from 'mongoose';

export interface IJoinRequest {
  user: ObjectId;
  event: ObjectId;
  status: 'pending' | 'approved' | 'rejected';

  createdAt: Date;
  updatedAt: Date;
}

export type IJoinRequestModules = Model<IJoinRequest, Record<string, unknown>>;
