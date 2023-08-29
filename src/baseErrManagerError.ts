import { callback, options } from './types/errManagerTypes';

export default class BaseErrManagerError extends Error {
  public httpStatusCode: number;
  public killProcess: boolean;
  public cb: callback;
  public data: any;

  constructor(
    message: string = '',
    callback: callback = (): void => {},
    data: any = {},
    opts?: options
  ) {
    super(message);

    this.httpStatusCode = opts?.httpStatus ?? 400;
    this.killProcess = opts?.killProcess ?? false;
    this.cb = callback;
    this.data = data;
  }
}
