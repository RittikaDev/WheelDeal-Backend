import { Model } from 'mongoose';

export type TRole = 'admin' | 'user';

export type TUser = {
  toObject(): { [x: string]: unknown; password: unknown };
  name: string;
  email: string;
  password?: string;
  role: TRole;
  isBlocked: boolean;
};

export type TUserAuth = {
  email: string;
  password: string;
};

export interface UserModel extends Model<TUser> {
  // eslint-disable-next-line no-unused-vars
  isUserExistByEmail(email: string): Promise<TUser>;

  isPasswordMatched(
    // eslint-disable-next-line no-unused-vars
    plainTextPassword: string,
    // eslint-disable-next-line no-unused-vars
    hashedPassword: string,
  ): Promise<boolean>;
}
