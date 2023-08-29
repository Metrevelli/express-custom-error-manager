export type callback = (message?: any) => any | void;

export interface IerrorMessageResponse {
  message: string;
  httpStatus: number;
}

export type options = Partial<{
  httpStatus: number;
  killProcess: boolean;
}>;
