import { Response } from "express";
import HttpStatusCode from "./HttpStatusCode.js";

export const ErrorResponse = (
  res: Response,
  error: unknown,
  statusCode: HttpStatusCode
) => {
  res.status(statusCode).json({
    status: "failed",
    message: (error as Error).message,
  });
};

export const SuccessResponse = (
  res: Response,
  message: string,
  statusCode: HttpStatusCode,
  data: unknown
) => {
  res.status(statusCode).json({
    status: "sucess",
    message: message,
    data: data,
  });
};

export const SuccessResponseWithoutData = (
  res: Response,
  message: string,
  statusCode: HttpStatusCode
) => {
  res.status(statusCode).json({
    status: "sucess",
    message: message,
  });
};
