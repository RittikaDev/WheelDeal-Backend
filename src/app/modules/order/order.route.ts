import express from 'express';
import { OrderController } from './order.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../auth/auth.constant';

const router = express.Router();

// router.post('/', auth(USER_ROLE.user), OrderController.createOrder);
router
  .route('/')
  .post(auth(USER_ROLE.user), OrderController.createOrder)
  .get(auth(USER_ROLE.admin), OrderController.getAllOrders);

router.get('/verify', auth(USER_ROLE.user), OrderController.verifyPayment);
router.get('/my-bookings', auth(USER_ROLE.user), OrderController.getUserOrders);

router.get('/revenue', OrderController.getRevenue);

export const OrderRoute = router;
