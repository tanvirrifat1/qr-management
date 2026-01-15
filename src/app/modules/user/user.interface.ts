import { Model, Types } from 'mongoose';
import { USER_ROLES } from '../../../enums/user';

export type IUser = {
  role: USER_ROLES;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  verified: boolean;
  subscription?: boolean;
  address?: string;
  image?: string;
  streetName?: string;
  area?: string;
  city?: string;
  zip?: number;
  state?: string;
  country?: string;
  block?: boolean;
  googleId?: string;
  phone?: string;
  authentication?: {
    isResetPassword: boolean;
    oneTimeCode: number;
    expireAt: Date;
  };
  createdAt?: Date;
  updatedAt?: Date;
};

export type UserModal = {
  isExistUserById(id: string): any;
  isExistUserByEmail(email: string): any;
  isAccountCreated(id: string): any;
  isMatchPassword(password: string, hashPassword: string): boolean;
} & Model<IUser>;
