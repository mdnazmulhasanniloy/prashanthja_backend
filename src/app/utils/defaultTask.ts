import Contents from '../modules/contents/contents.models';
import { USER_ROLE } from '../modules/user/user.constants';
import { User } from '../modules/user/user.models';

export async function defaultTask() {
  // Add your default task here

  // check admin is exist
  const admin = await User.findOne({ role: USER_ROLE?.admin });
  if (!admin) {
    await User.create({
      name: 'MD Nazmul Hasan',
      email: 'admin@gmail.com',
      phoneNumber: '+8801321834780',
      password: '112233',
      role: 'admin',
      expireAt: null,
      location: {
        type: 'Point',
        coordinates: [90.412518, 23.810331],
      },
      verification: {
        otp: '0',
        status: true,
      },
    });
  }

  const content = await Contents.findOne({});
  if (!content) {
    await Contents.create({
      aboutUs: '',
      termsAndConditions: '',
      privacyPolicy: '',
      supports: '',
      faq: '',
    });
  }
}
