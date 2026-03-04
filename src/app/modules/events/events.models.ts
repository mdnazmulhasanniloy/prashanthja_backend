import { model, Schema } from 'mongoose';
import { IEvents, IEventsModules } from './events.interface';

const LocationSchema = new Schema({
  type: { type: String, required: true, default: 'Point' },
  coordinates: { type: [Number], required: true, default: [0, 0] }, // [longitude, latitude]
});

const eventsSchema = new Schema<IEvents>(
  {
    images: [
      {
        type: String,
        required: true,
      },
    ],
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    joinedUsers: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],

    description: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    location: {
      type: LocationSchema,
      required: true,
    },

    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

eventsSchema.index({ title: 'text' }); // full-text search on title
eventsSchema.index({ date: 1 }); // ascending index on date
eventsSchema.index({ location: '2dsphere' }); // geo index

const Events = model<IEvents, IEventsModules>('Events', eventsSchema);
export default Events;
