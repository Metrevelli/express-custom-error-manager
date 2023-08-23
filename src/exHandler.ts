import BaseExHandlerError from './baseExHandlerError';
import {
  Idata,
  IerrorMessageResponse,
  callback,
  options
} from './types/exHandlerTypes';
import { Request, Response, NextFunction } from 'express';

export default class ExHandler {
  private static instance: ExHandler;

  private res: Response;
  private next: NextFunction;

  constructor(req: Request, res: Response, next: NextFunction) {
    this.res = res;
    this.next = next;
  }

  public static register() {
    return (req: Request, res: Response, next: NextFunction) => {
      if (!ExHandler.instance) {
        ExHandler.instance = new ExHandler(req, res, next);
      } else {
        ExHandler.instance.setReqResNext(req, res, next);
      }
      next();
    };
  }

  public static middleware() {
    return async function (
      err: BaseExHandlerError,
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
    return (data?: Idata): any => {
      ExHandler.instance.next(
        new BaseExHandlerError(message, callback, data, opts)
      );
    };
  }

  private setReqResNext(req: Request, res: Response, next: NextFunction) {
    this.res = res;
    this.next = next;
  }
}
