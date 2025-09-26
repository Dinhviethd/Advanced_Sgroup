import { HttpStatusCode, AppErrorCode } from "@/common/const/constants";

class AppError extends Error {
  constructor(
    public statusCode: HttpStatusCode,
    public message: string,
    public errorCode?: AppErrorCode
  ) {
    super(message);
  }
}

export default AppError;