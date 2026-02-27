import httpStatus from 'http-status';
import { IEvents } from './events.interface';
import Events from './events.models';
import AppError from '../../error/AppError';

const createEvents = async (payload: IEvents) => {
  const result = await Events.create(payload);
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create events');
  }
  return result;
};

const getAllEvents = async (query: Record<string, any>) => {};

const getEventsById = async (id: string) => {
  const result = await Events.findById(id);
  if (!result || result?.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'Events not found!');
  }
  return result;
};

const updateEvents = async (id: string, payload: Partial<IEvents>) => {
  const result = await Events.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update Events');
  }
  return result;
};

const deleteEvents = async (id: string) => {
  const result = await Events.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete events');
  }
  return result;
};
const joinEvent = async (id: string, userId: string) => {
  const result = await Events.findByIdAndUpdate(
    id,
    { $addToSet: { joinedUsers: userId } },
    { new: true },
  );
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to join events');
  }
  return result;
};

export const eventsService = {
  createEvents,
  getAllEvents,
  getEventsById,
  updateEvents,
  deleteEvents,
  joinEvent,
};
