import { Model, Types } from 'mongoose';

export interface ILocation {
  type: string;
  coordinates: [number, number];
}
export interface IUser {
  _id?: Types.ObjectId;
  profile: string;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  role: string;
  password: string;
  bio: string;

  // profile Details
  gender: 'Male' | 'Female' | 'Others';
  loginWth: 'google' | 'apple' | 'facebook' | 'credentials';
  dateOfBirth: string;
  status: string;
  needsPasswordChange: boolean;
  passwordChangedAt?: Date;
  accommodationAvailable: boolean;
  isDeleted: boolean;
  location: ILocation;
  expireAt?: Date | null;
  verification: {
    otp: string | number;
    expiresAt: Date;
    status: boolean;
  };
  device: {
    ip: string;
    browser: string;
    os: string;
    device: string;
    lastLogin: string;
  };
}

export interface UserModel extends Model<IUser> {
  isUserExist(email: string): Promise<IUser>;
  IsUserExistId(id: string): Promise<IUser>;
  IsUserExistUserName(userName: string): Promise<IUser>;

  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
}
