import moment from 'moment';
import Events from '../events/events.models';
import { User } from '../user/user.models';
import { USER_ROLE } from '../user/user.constants';

const dashboardCards = async () => {
  const totalEvents = await Events.countDocuments({});
  const totalUsers = await User.countDocuments({ role: { $ne: 'admin' } });
  return { totalEvents: totalEvents || 0, totalUsers: totalUsers || 0 };
};

const dashboardOverview = async (query: Record<string, any>) => {
  // Calculate monthly income
  // JoinYear: '2022', role: ''
  const userYear = query?.JoinYear ? query?.JoinYear : moment().year();
  const startOfUserYear = moment().year(userYear).startOf('year');
  const endOfUserYear = moment().year(userYear).endOf('year');

  const monthlyUser = await User.aggregate([
    {
      $match: {
        'verification.status': true,
        role: { $ne: USER_ROLE.admin },
        createdAt: {
          $gte: startOfUserYear.toDate(),
          $lte: endOfUserYear.toDate(),
        },
      },
    },
    {
      $group: {
        _id: { month: { $month: '$createdAt' } },
        total: { $sum: 1 },
      },
    },
    {
      $sort: { '_id.month': 1 },
    },
  ]);

  // Format monthly income to have an entry for each month
  const formattedMonthlyUsers = Array.from({ length: 12 }, (_, index) => ({
    month: moment().month(index).format('MMM'),
    total: 0,
  }));

  monthlyUser.forEach(entry => {
    formattedMonthlyUsers[entry._id.month - 1].total = Math.round(entry.total);
  });

  return {
    monthlyUsers: formattedMonthlyUsers,
  };
};
export const dashboardService = {
  dashboardCards,
  dashboardOverview,
};
