import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { MessageService } from './message.service';

const getAllMessages = catchAsync(async (req, res) => {
  const result = await MessageService.getAllMessages(req.params.id, req.query);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Messages retrived successfully',
    data: result,
  });
});

const getAllRecentMessage = catchAsync(async (req, res) => {
  const result = await MessageService.getAllRecentMessage(
    req.query,
    req.user.id
  );
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Messages retrived successfully',
    data: result,
  });
});

export const MessageController = {
  getAllMessages,
  getAllRecentMessage,
};
