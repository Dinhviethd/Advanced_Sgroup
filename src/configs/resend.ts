import { Resend } from "resend";
import { appEnv } from "@/configs/env.config";

const resend = new Resend(appEnv.RESEND_API_KEY);

export default resend;