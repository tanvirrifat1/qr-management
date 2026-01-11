import { StatusCodes } from 'http-status-codes';
import { JwtPayload } from 'jsonwebtoken';
import { USER_ROLES } from '../../../enums/user';
import ApiError from '../../../errors/ApiError';
import { emailHelper } from '../../../helpers/emailHelper';
import { emailTemplate } from '../../../shared/emailTemplate';
import generateOTP from '../../../util/generateOTP';
import { IUser } from './user.interface';
import { User } from './user.model';
import unlinkFile from '../../../shared/unlinkFile';
import { sendEmail } from '../../../helpers/sendMail';

const createBuyerToDB = async (payload: IUser) => {
  if (
    payload.role &&
    (payload.role === USER_ROLES.ADMIN ||
      payload.role === USER_ROLES.SUPER_ADMIN)
  ) {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      'You cannot create an Admin or Super Admin user from this route.'
    );
  }

  if (payload.verified === true) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Cannot create a verified user directly.'
    );
  }

  payload.role = USER_ROLES.BUYER;

  const result = await User.create(payload);

  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  const otp = generateOTP();
  const emailValues = {
    name: `${result.firstName} `,
    otp,
    email: result.email,
  };

  const accountEmailTemplate = emailTemplate.createAccount(emailValues);
  emailHelper.sendEmail(accountEmailTemplate);

  // Update user with authentication details
  const authentication = {
    oneTimeCode: otp,
    expireAt: new Date(Date.now() + 10 * 60000),
  };
  const updatedUser = await User.findOneAndUpdate(
    { _id: result._id },
    { $set: { authentication } }
  );
  if (!updatedUser) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found for update');
  }

  return result;
};

const updateProfileToDB = async (
  user: JwtPayload,
  payload: Partial<IUser>
): Promise<Partial<IUser | null>> => {
  const { id } = user;
  const isExistUser = await User.isExistUserById(id);

  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  // Delete old images if new images are provided
  if (payload.image && isExistUser.image) {
    unlinkFile(isExistUser.image);
  }

  const updateDoc = await User.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });

  return updateDoc;
};

const suspendedUser = async (id: string) => {
  const updatedUser = await User.findOneAndUpdate(
    { _id: id },
    { block: true },
    { new: true }
  );

  if (!updatedUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  if (updatedUser.email) {
    sendEmail(
      updatedUser?.email,
      'Your Account Has Been Suspended',
      `
      Hello ${updatedUser.firstName ?? ''},

      We want to inform you that your account has been suspended.
      
      If you believe this is a mistake, please contact support.

      Thank you.
    `.trim()
    );
  }

  return updatedUser;
};

const activeUser = async (id: string) => {
  const updatedUser = await User.findOneAndUpdate(
    { _id: id },
    { block: false },
    { new: true }
  );

  if (!updatedUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  if (updatedUser?.email) {
    sendEmail(
      updatedUser.email,
      'Your Account Has Been Activated',
      `
      Hello ${updatedUser.firstName ?? ''},

      We are pleased to inform you that your account has been successfully activated.

      You can now log in and continue using all available services without any restrictions.

      If you have any questions or need assistance, feel free to contact our support team.

      Thank you.
    `.trim()
    );
  }

  return updatedUser;
};

const getUserDetails = async (id: string) => {
  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }
  return user;
};

export const UserService = {
  createBuyerToDB,
  updateProfileToDB,
  suspendedUser,
  activeUser,
  getUserDetails,
};
