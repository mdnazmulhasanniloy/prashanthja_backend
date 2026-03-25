import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { dashboardService } from './dashboard.service';
import sendResponse from '../../utils/sendResponse';

const dashboardCards = catchAsync(async (req: Request, res: Response) => {
  const result = await dashboardService.dashboardCards();
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Dashboard card get successfully',
    data: result,
  });
});

const dashboardOverview = catchAsync(async (req: Request, res: Response) => {
  const result = await dashboardService.dashboardOverview(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Dashboard overview fetched successfully',
    data: result,
  });
});

export const dashboardController = {
  dashboardCards,
  dashboardOverview,
};
