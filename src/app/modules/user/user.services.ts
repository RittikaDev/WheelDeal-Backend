import { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import { User } from './user.model';

import bcrypt from 'bcrypt';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status-codes';

export const updatePassword = async (
  userData: JwtPayload,
  password: string,
  newPassword: string,
): Promise<void> => {
  // Fetch the user by ID
  const user = await User.findOne({ email: userData.userEmail }).select(
    '+password',
  );

  if (!user) throw new AppError(httpStatus.NOT_FOUND, 'User not found');

  console.log(password, user.password);
  // Verify current password
  const isMatch = bcrypt.compare(password, user.password!);
  if (!isMatch)
    throw new AppError(httpStatus.BAD_REQUEST, 'Current password is incorrect');

  // Hash the new password and save the user
  const hashedNewPassword = await bcrypt.hash(
    newPassword,
    Number(config.bcrypt_salt_round),
  );
  user.password = hashedNewPassword;

  await user.save();
};

export const UserService = {
  updatePassword,
};
