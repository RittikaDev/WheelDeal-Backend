import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { NewsletterService } from './newsletter.service';
import httpStatus from 'http-status-codes';

const createNewsletter = catchAsync(async (req, res) => {
  const newsletter = await NewsletterService.createNewsletter(
    req.body,
    req?.user?.id,
  );
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Newsletter created successfully',
    data: newsletter,
  });
});

const getNewsletters = catchAsync(async (req, res) => {
  const newsletters = await NewsletterService.getAllNewsletters();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Newsletters retrieved successfully',
    data: newsletters,
  });
});

const updateNewsletter = catchAsync(async (req, res) => {
  const newsletterId = req.params.id;
  const updatedNewsletter = await NewsletterService.updateNewsletter(
    newsletterId,
    req.body,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Newsletter updated successfully',
    data: updatedNewsletter,
  });
});

const getNewsletterById = catchAsync(async (req, res) => {
  const newsletter = await NewsletterService.getNewsletterById(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Newsletter retrieved successfully',
    data: newsletter,
  });
});

export const NewsletterController = {
  createNewsletter,
  getNewsletters,
  updateNewsletter,
  getNewsletterById,
};
