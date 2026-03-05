import httpStatus from 'http-status';
import { IJoinRequest } from './joinRequest.interface';
import JoinRequest from './joinRequest.models';
import AppError from '../../error/AppError';
import QueryBuilder from '../../class/builder/QueryBuilder';
import { notificationServices } from '../notification/notification.service';
import Events from '../events/events.models';
import { IEvents } from '../events/events.interface';
import { modeType } from '../notification/notification.interface';
import { REQUEST_STATUS } from './joinRequest.constants';
import { startSession, Types } from 'mongoose';

const createJoinRequest = async (payload: IJoinRequest) => {
  const event: IEvents | null = await Events.findById(payload.event);
  if (!event) throw new AppError(httpStatus.BAD_REQUEST, 'Event id is invalid');
  const result = await JoinRequest.create(payload);
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create joinRequest');
  }

  notificationServices.insertNotificationIntoDb({
    receiver: event.author,
    message: 'You Have a New Event Join Request 🎉',
    description:
      'A user is interested in joining your event. Check the request and approve or decline it.',
    refference: result._id,
    model_type: modeType.JoinRequest,
  });

  return result;
};

const getAllJoinRequest = async (query: Record<string, any>) => {
  if (query.user) {
    query['user'] = new Types.ObjectId(query.user);
  }
  if (query.event) {
    query['event'] = new Types.ObjectId(query.event);
  }
  const joinRequestModel = new QueryBuilder(
    JoinRequest.find().populate([
      { path: 'user', select: '_id name email profile' },
      { path: 'event' },
    ]),
    query,
  )
    .search([])
    .filter()
    .paginate()
    .sort()
    .fields();

  const data = await joinRequestModel.modelQuery;
  const meta = await joinRequestModel.countTotal();

  return {
    data,
    meta,
  };
};

const approvedJoinRequest = async (id: string) => {
  const session = await startSession();

  try {
    session.startTransaction();

    const result = await JoinRequest.findByIdAndUpdate(
      id,
      {
        status: REQUEST_STATUS.approved,
      },
      { new: true, session },
    );

    if (!result) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Failed to approve the join request.',
      );
    }

    const event = await Events.findByIdAndUpdate(
      result.event,
      {
        $addToSet: { joinedUsers: result.user },
      },
      { new: true, session },
    );

    if (!event) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Failed to update the event with the approved user.',
      );
    }

    await session.commitTransaction();
    session.endSession();
    notificationServices.insertNotificationIntoDb({
      receiver: result.user,
      message: 'Great news! Your request was approved 🎉',
      description:
        'The event organizer has approved your request. You are now part of the event.',
      refference: event._id,
      model_type: modeType.JoinRequest,
    });
    return result;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const rejectedJoinRequest = async (id: string) => {
  try {
    const result = await JoinRequest.findByIdAndUpdate(
      id,
      {
        status: REQUEST_STATUS.rejected,
      },
      { new: true },
    );

    if (!result) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Failed to approve the join request.',
      );
    }

    notificationServices.insertNotificationIntoDb({
      receiver: result.user,
      message: 'Your join request was declined',
      description:
        'The event organizer has declined your request to join this event. You may explore other events.',
      refference: result._id,
      model_type: modeType.JoinRequest,
    });
    return result;
  } catch (error: any) {
    throw new AppError(httpStatus.BAD_REQUEST, error?.message);
  }
};

const getJoinRequestById = async (id: string) => {
  const result = await JoinRequest.findById(id).populate([
    { path: 'user', select: '_id name email profile' },
    { path: 'event' },
  ]);
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'JoinRequest not found!');
  }
  return result;
};

const updateJoinRequest = async (
  id: string,
  payload: Partial<IJoinRequest>,
) => {
  const result = await JoinRequest.findByIdAndUpdate(id, payload, {
    new: true,
  });
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update JoinRequest');
  }
  return result;
};

const deleteJoinRequest = async (id: string) => {
  const result = await JoinRequest.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete joinRequest');
  }
  return result;
};

export const joinRequestService = {
  createJoinRequest,
  getAllJoinRequest,
  getJoinRequestById,
  updateJoinRequest,
  deleteJoinRequest,
  approvedJoinRequest,
  rejectedJoinRequest,
};
