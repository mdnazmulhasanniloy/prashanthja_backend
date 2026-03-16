import { NextFunction, Request, Response } from 'express';
import { uploadToS3 } from '../utils/s3';
import catchAsync from '../utils/catchAsync';

const uploadSingle = (name: string) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    console.log(name);
    if (req?.file) {
      req.body[`${name}`] = await uploadToS3({
        file: req.file,
        fileName: `images/${name}/${Math.floor(100000 + Math.random() * 900000)}`,
      });
    }
    console.log(req.file);
    console.log(req.body);

    next();
  });
};

export default uploadSingle;
