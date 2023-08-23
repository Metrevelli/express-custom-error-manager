import { Idata, callback, options } from './types/exHandlerTypes';

export default class BaseExHandlerError extends Error {
  public httpStatusCode: number;
  public killProcess: boolean;
  public cb: callback;
  public data: Idata;

  constructor(
    message: string = '',
    callback: callback = (): void => {},
    data: Idata = {},
    opts?: options
  ) {
    super(message);

    this.httpStatusCode = opts?.httpStatus ?? 400;
    this.killProcess = opts?.killProcess ?? false;
    this.cb = callback;
    this.data = data;
  }
}
