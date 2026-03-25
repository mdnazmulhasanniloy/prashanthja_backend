
import { model, Schema } from 'mongoose';
import { IDashboard, IDashboardModules } from './dashboard.interface';

const dashboardSchema = new Schema<IDashboard>(
  {
    isDeleted: { type: 'boolean', default: false },
  },
  {
    timestamps: true,
  }
);

//dashboardSchema.pre('find', function (next) {
//  //@ts-ignore
//  this.find({ isDeleted: { $ne: true } });
//  next();
//});

//dashboardSchema.pre('findOne', function (next) {
  //@ts-ignore
  //this.find({ isDeleted: { $ne: true } });
 // next();
//});

dashboardSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

const Dashboard = model<IDashboard, IDashboardModules>(
  'Dashboard',
  dashboardSchema
);
export default Dashboard;