import express from 'express';
import validateRequest from '../../middlewares/validateRequest';

import auth from '../../middlewares/auth';
import { USER_ROLE } from './user.constant';
import { UserController } from './user.controller';

const router = express.Router();

router.patch(
  '/update-password',
  auth(USER_ROLE.user),
  UserController.updatePassword,
);

export const UserRoute = router;
