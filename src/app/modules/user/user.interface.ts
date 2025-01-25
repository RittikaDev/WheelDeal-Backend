import { Model, Document } from 'mongoose';

export type TRole = 'admin' | 'user';

export interface TUser extends Document {
  toObject(): { [x: string]: unknown; password: unknown };
  name: string;
  email: string;
  password?: string;
  passwordChangedAt?: Date;
  phone?: string;
  address?: string;
  city?: string;
  role: TRole;
  isBlocked: boolean;
}

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
  isJWTIssuedBeforePasswordChanged(
    passwordChangedTimestamp: Date,
    jwtIssuedTimestamp: number,
  ): boolean;
}
