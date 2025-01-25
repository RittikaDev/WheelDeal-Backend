import express from 'express';
import { OrderController } from './order.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../auth/auth.constant';

const router = express.Router();

router.post('/', auth(USER_ROLE.user), OrderController.createOrder);
router.get('/verify', auth(USER_ROLE.user), OrderController.verifyPayment);
router.get('/revenue', OrderController.getRevenue);

export const OrderRoute = router;
