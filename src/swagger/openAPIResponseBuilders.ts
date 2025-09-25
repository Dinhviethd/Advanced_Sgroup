import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';
import { ServiceResponseSchema } from '../common';
import { HttpResponseBodySuccessDtoSchema } from '../common/dtos/httpResponseBodySuccess.dto';


export function createApiResponse(schema: z.ZodTypeAny | null, description: string, statusCode = StatusCodes.OK) {
  return {
    [statusCode]: {
      description,
      content: {
        'application/json': {
          schema: ServiceResponseSchema(schema),
        },
      },
    },
  };
}