import type { Request, Response, NextFunction } from "express";


type Error = {
    stack: string;
    message: string;
    status?: string;
    statusCode?: number;
};
const globalErrHandler = (err: Error, req:Request, res:Response, next:NextFunction) => {
    const stack = err.stack;
    const message = err.message;
    const status = err.status ? err.status : "failed";
    const statusCode = err.statusCode ? err.statusCode : 500;
    res.status(statusCode).json({
      status,
      message,
      stack,
    });
  };
  
  //Not found
  const notFoundErr = (req:Request, res:Response, next:NextFunction) => {
    const err = new Error(`Can't find ${req.originalUrl} on the server`);
    next(err);
  };
  
export { globalErrHandler, notFoundErr };