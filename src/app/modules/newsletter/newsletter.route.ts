import express from 'express';
import { NewsletterController } from './newsletter.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../auth/auth.constant';

const router = express.Router();

// Admin routes (CRUD)
router.post('/', auth(USER_ROLE.admin), NewsletterController.createNewsletter);
router.get('/', NewsletterController.getNewsletters);
router.patch(
  '/:id',
  auth(USER_ROLE.admin),
  NewsletterController.updateNewsletter,
);
router.get(
  '/:id',
  auth(USER_ROLE.admin),
  NewsletterController.getNewsletterById,
);

router.get('/public', NewsletterController.getNewsletters);

export const NewsletterRoute = router;
