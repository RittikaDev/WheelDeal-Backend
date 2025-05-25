import { Router } from 'express';
import { CarRoute } from '../modules/car/car.route';
import { OrderRoute } from '../modules/order/order.route';
import { AuthRoutes } from '../modules/auth/auth.route';
import { UserRoute } from '../modules/user/user.route';
import { CouponRoute } from '../modules/coupon/coupon.route';
import { NewsletterRoute } from '../modules/newsletter/newsletter.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/user',
    route: UserRoute,
  },
  {
    path: '/cars',
    route: CarRoute,
  },
  {
    path: '/coupon',
    route: CouponRoute,
  },
  {
    path: '/orders',
    route: OrderRoute,
  },
  {
    path: '/newsletter',
    route: NewsletterRoute,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
