import { model, Schema, Types } from 'mongoose';
import { IJoinRequest, IJoinRequestModules } from './joinRequest.interface';

const joinRequestSchema = new Schema<IJoinRequest>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    event: {
      type: Schema.Types.ObjectId,
      ref: 'Events',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
    },
  },
  {
    timestamps: true,
  },
);

 
const JoinRequest = model<IJoinRequest, IJoinRequestModules>(
  'JoinRequest',
  joinRequestSchema,
);
export default JoinRequest;
