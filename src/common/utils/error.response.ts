import { NextFunction, Request, Response } from "express";

export class AppError extends Error{
    statusCode: number;
    constructor(statusCode: number, message: string){
        super(message);
        this.statusCode= statusCode;
        Error.captureStackTrace(this, this.constructor) /*Để biết được stack trace gốc: Nếu k có thì khi có lỗi, nó sẽ báo lỗi ở AppError chứ không
   phải vị trí chính xác của lỗi */ 
    }
}
type AsyncController = (
    req: Request,
    res: Response,
    next: NextFunction
) => Promise<any>;
export const asyncHandler =(controller: AsyncController): AsyncController=>{
    return async (req, res, next) => {
        try {
           await controller(req, res, next)
        } catch (error) {
            next(error)
        }
    }
}