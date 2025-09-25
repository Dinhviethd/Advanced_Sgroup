import { z } from "zod";

export interface HttpResponseBodySuccessDto<T> {
	data: T;
	totalPage?: Number;
}

export const HttpResponseBodySuccessDtoSchema = <T extends z.ZodTypeAny>(dataSchema: T | null) =>
	z.object({
	  data: dataSchema ? dataSchema.optional() : z.null(),
	  totalPage: z.number(),
	});