import BaseErrManagerError from './baseErrManagerError';
import {
  IerrorMessageResponse,
  callback,
  options
} from './types/errManagerTypes';
import { Request, Response, NextFunction } from 'express';

export default class ErrManager {
  private static instance: ErrManager;

  private res: Response;
  private next: NextFunction;

  constructor(req: Request, res: Response, next: NextFunction) {
    this.res = res;
    this.next = next;
  }

  public static register() {
    return (req: Request, res: Response, next: NextFunction) => {
      if (!ErrManager.instance) {
        ErrManager.instance = new ErrManager(req, res, next);
      } else {
        ErrManager.instance.setReqResNext(req, res, next);
      }
      next();
    };
  }

  public static middleware() {
    return async function (
      err: BaseErrManagerError,
      req: Request,
      res: Response,
      next: NextFunction
    ) {
      const errorMessage: IerrorMessageResponse = {
        message: err.message,
        httpStatus: err.httpStatusCode
      };

      await err.cb(err.data);
      res.status(err.httpStatusCode).send(errorMessage);

      if (err.killProcess) {
        console.log(err);
        process.exit(1);
      }
    };
  }

  public static createException(
    message: string,
    callback: callback,
    opts?: options
  ) {
    return (data?: any): any => {
      ErrManager.instance.next(
        new BaseErrManagerError(message, callback, data, opts)
      );
    };
  }

  private setReqResNext(req: Request, res: Response, next: NextFunction) {
    this.res = res;
    this.next = next;
  }
}
