import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { joinRequestService } from './joinRequest.service';
import sendResponse from '../../utils/sendResponse';

const createJoinRequest = catchAsync(async (req: Request, res: Response) => {
  req.body['user'] = req?.user?.userId;
  const result = await joinRequestService.createJoinRequest(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'JoinRequest created successfully',
    data: result,
  });
});

const getMyJoinRequest = catchAsync(async (req: Request, res: Response) => {
  req.query['user'] = req.user.userId;
  const result = await joinRequestService.getAllJoinRequest(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'My all request fetched successfully',
    data: result,
  });
});
const getAllJoinRequest = catchAsync(async (req: Request, res: Response) => {
  const result = await joinRequestService.getAllJoinRequest(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All joinRequest fetched successfully',
    data: result,
  });
});

const getJoinRequestById = catchAsync(async (req: Request, res: Response) => {
  const result = await joinRequestService.getJoinRequestById(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'JoinRequest fetched successfully',
    data: result,
  });
});

const updateJoinRequest = catchAsync(async (req: Request, res: Response) => {
  const result = await joinRequestService.updateJoinRequest(
    req.params.id,
    req.body,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'JoinRequest updated successfully',
    data: result,
  });
});

const approvedJoinRequest = catchAsync(async (req: Request, res: Response) => {
  const result = await joinRequestService.approvedJoinRequest(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'JoinRequest approved successfully',
    data: result,
  });
});

const rejectedJoinRequest = catchAsync(async (req: Request, res: Response) => {
  const result = await joinRequestService.rejectedJoinRequest(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'JoinRequest reject successfully',
    data: result,
  });
});

const deleteJoinRequest = catchAsync(async (req: Request, res: Response) => {
  const result = await joinRequestService.deleteJoinRequest(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'JoinRequest deleted successfully',
    data: result,
  });
});

export const joinRequestController = {
  createJoinRequest,
  getAllJoinRequest,
  getJoinRequestById,
  updateJoinRequest,
  deleteJoinRequest,
  approvedJoinRequest,
  rejectedJoinRequest,
  getMyJoinRequest,
};
