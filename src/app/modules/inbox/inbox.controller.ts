import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { InboxService } from './inbox.service';

const createInboxToDb = catchAsync(async (req, res) => {
  const { id: receiverId } = req.params as { id: string };
  const senderId = req.user.id as string;

  const value: any = {
    senderId,
    receiverId,
  };

  const result = await InboxService.createInboxToDB(value);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Inbox created successfully',
    data: result,
  });
});

const getAllInboxs = catchAsync(async (req, res) => {
  const result = await InboxService.getAllInboxFromDb(req.user.id, req.query);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Inbox retrived successfully',
    data: result,
  });
});

const deleteInbox = catchAsync(async (req, res) => {
  const { id } = req.params as { id: string };
  const result = await InboxService.deleteInbox(id);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Inbox deleted successfully',
    data: result,
  });
});

export const InboxController = {
  createInboxToDb,
  getAllInboxs,
  deleteInbox,
};
