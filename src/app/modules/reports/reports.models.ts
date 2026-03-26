import { model, Schema } from 'mongoose';
import { IReports, IReportsModules } from './reports.interface';

const reportsSchema = new Schema<IReports>(
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
    message: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);


const Reports = model<IReports, IReportsModules>('Reports', reportsSchema);
export default Reports;
