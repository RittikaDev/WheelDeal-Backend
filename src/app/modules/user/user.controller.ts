import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserService } from './user.services';
import httpStatus from 'http-status-codes';

const updatePassword = catchAsync(async (req, res) => {
  console.log(req.body);
  const { password, newPassword } = req.body;
  console.log(password);

  // Call the service to update the password
  await UserService.updatePassword(req.user!, password, newPassword);

  // Send a success response
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password updated successfully',
    data: null, // No additional data is returned in this case
  });
});

export const UserController = { updatePassword };
