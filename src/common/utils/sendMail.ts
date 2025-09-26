import resend from "@/configs/resend";
import { appEnv } from "@/configs/env.config";

type Params = {
  to: string;
  subject: string;
  text: string;
  html: string;
};

const getFromEmail = () =>
  appEnv.NODE_ENV === "development" ? "onboarding@resend.dev" : appEnv.EMAIL_SENDER;

const getToEmail = (to: string) =>
  appEnv.NODE_ENV === "development" ? "delivered@resend.dev" : to;

export const sendMail = async ({ to, subject, text, html }: Params) =>
  await resend.emails.send({
    from: getFromEmail(),
    to: getToEmail(to),
    subject,
    text,
    html,
  });