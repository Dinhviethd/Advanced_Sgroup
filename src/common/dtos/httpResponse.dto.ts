import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ZodError, ZodSchema } from 'zod';
import { HttpResponseBodySuccessDto } from './httpResponseBodySuccess.dto';
import { HTTPException } from '@tsed/exceptions';
// import { ResponseStatus, ServiceResponse } from '@/common/models/serviceResponse';

// export const handleServiceResponse = (serviceResponse: ServiceResponse<any>, response: Response) => {
//   return response.status(serviceResponse.code).send(serviceResponse);
// };

// export const validateRequest = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
//   try {
//     schema.parse({ body: req.body, query: req.query, params: req.params });
//     next();
//   } catch (err) {
//     const errorMessage = `Invalid input: ${(err as ZodError).errors.map((e) => e.message).join(', ')}`;
//     const statusCode = StatusCodes.BAD_REQUEST;
//     res.status(statusCode).send(new ServiceResponse<null>(ResponseStatus.Failed, errorMessage, null, statusCode));
//   }
// };


export class HttpResponseDto {
    async success<T>(data: HttpResponseBodySuccessDto<T>, res: Response) {
        return  res.status(StatusCodes.OK).json(data)
    }

    async created<T>(data: HttpResponseBodySuccessDto<T>, res: Response) {
        return res.status(StatusCodes.CREATED).json(data)
    }

    async exception(exceptions: HTTPException, res: Response) {
        return res.status(exceptions.status).json({
            status: exceptions.status,
            messenger: exceptions.message
        })
    }
}
export default new HttpResponseDto();