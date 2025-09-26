import { appEnv } from "@/configs/env.config";
import {
  CONFLICT,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  TOO_MANY_REQUESTS,
  UNAUTHORIZED,
} from "@/common/const/constants";
import { verifiedCodeType } from "@/common/const/constants";
import { Repository } from "typeorm"
import { AppDataSource } from "@/configs/database.config";
import { User } from '@/modules/user/user.model'
import { VerifiedCode } from '@/modules/verificationCode/verification.model'
import appAssert from "@/common/utils/appAssert";
import { compareValue, hashValue } from "@/common/utils/password.util";
import {
  fiveMinutesAgo,
  oneHourFromNow,
} from "@/common/utils/date.util";
import {
  getPasswordResetTemplate,
  getVerifyEmailTemplate,
} from "@/common/utils/emailTemplate";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "@/common/utils/jwt";
import { sendMail } from "@/common/utils/sendMail";

type CreateAccountParams = {
  email: string;
  password: string;
  userAgent?: string;
  fullname: string;
  avatarUrl?: string;
};

type LoginParams = {
  email: string;
  password: string;
  userAgent?: string;
};

type ResetPasswordParams = {
  password: string;
  verificationCode: string;
};

class authService {
  private userRepository: Repository<User>;
  private verifiedCodeRepository: Repository<VerifiedCode>
  
  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
    this.verifiedCodeRepository = AppDataSource.getRepository(VerifiedCode);
  }

  async createAccount(data: CreateAccountParams) {
    const foundUser = await this.userRepository.findOneBy({
      email: data.email
    });
    appAssert(!foundUser, CONFLICT, "Email already in use");

    const hashPass = await hashValue(data.password);
    const newUser = await this.userRepository.save({
      email: data.email,
      password: hashPass,
      fullName: data.fullname,
      avatar: data.avatarUrl,
    });

    const verificationCode = await this.verifiedCodeRepository.save({
      ExpiredAt: oneHourFromNow(), 
      user: newUser,
      type: verifiedCodeType.EmailVerification
    });

    const url = `${appEnv.CORS_ORIGIN}/email/verify/${verificationCode.idVerifiedCode}`;

    // Send verification email
    await sendMail({
      to: newUser.email,
      ...getVerifyEmailTemplate(url),
    });

    const accessToken = signAccessToken({ userId: newUser.idUser });
    const refreshToken = signRefreshToken({ userId: newUser.idUser });

    return {
      user: {
        idUser: newUser.idUser,
        email: newUser.email,
        fullName: newUser.fullName,
        createdAt: newUser.createdAt,
      },
      accessToken,
      refreshToken,
    };
  }

  async loginUser({ email, password }: LoginParams) {
    const user = await this.userRepository.findOneBy({ email });
    appAssert(user, UNAUTHORIZED, "Invalid email or password");

    const isValid = await compareValue(password, user.password);
    appAssert(isValid, UNAUTHORIZED, "Invalid email or password");

    const accessToken = signAccessToken({ userId: user.idUser });
    const refreshToken = signRefreshToken({ userId: user.idUser });

    return {
      user: {
        idUser: user.idUser,
        email: user.email,
        fullName: user.fullName,
        createdAt: user.createdAt,
      },
      accessToken,
      refreshToken,
    };
  }

  async verifyEmail(code: string) {
    const validCode = await this.verifiedCodeRepository.findOne({
      where: {
        idVerifiedCode: parseInt(code),
        type: verifiedCodeType.EmailVerification,
      },
      relations: ['user']
    });

    appAssert(validCode, NOT_FOUND, "Invalid or expired verification code");
    appAssert(validCode.ExpiredAt > new Date(), NOT_FOUND, "Verification code has expired");

    // Update user email verification status
    await this.userRepository.update(validCode.user.idUser, {
      emailVerified: true,
    });

    // Delete the verification code
    await this.verifiedCodeRepository.remove(validCode);

    const updatedUser = await this.userRepository.findOneBy({ 
      idUser: validCode.user.idUser 
    });

    return {
      user: updatedUser,
    };
  }

  async refreshUserAccessToken(refreshToken: string) {
    const { payload, error } = verifyRefreshToken(refreshToken);
    appAssert(payload, UNAUTHORIZED, error || "Invalid refresh token");

    // Verify user still exists
    const user = await this.userRepository.findOneBy({ 
      idUser: (payload as any).userId 
    });
    appAssert(user, UNAUTHORIZED, "User not found");

    const accessToken = signAccessToken({ userId: user.idUser });

    return {
      accessToken,
      newRefreshToken: undefined, // Không tạo refresh token mới mỗi lần refresh
    };
  }

  async sendPasswordResetEmail(email: string) {
    try {
      const user = await this.userRepository.findOneBy({ email });
      appAssert(user, NOT_FOUND, "User not found");

      // Check for max password reset requests (2 emails in 5min)
      const fiveMinAgo = fiveMinutesAgo();
      const count = await this.verifiedCodeRepository.count({
        where: {
          user: { idUser: user.idUser },
          type: verifiedCodeType.PasswordVerification,
          createdAt: { $gte: fiveMinAgo } as any,
        },
      });

      appAssert(
        count <= 1,
        TOO_MANY_REQUESTS,
        "Too many requests, please try again later"
      );

      const expiresAt = oneHourFromNow();
      const verificationCode = await this.verifiedCodeRepository.save({
        user: user,
        type: verifiedCodeType.PasswordVerification,
        ExpiredAt: expiresAt,
      });

      const url = `${appEnv.CORS_ORIGIN}/password/reset?code=${verificationCode.idVerifiedCode}&exp=${expiresAt.getTime()}`;

      const { data, error } = await sendMail({
        to: email,
        ...getPasswordResetTemplate(url),
      });

      appAssert(
        data?.id,
        INTERNAL_SERVER_ERROR,
        `${error?.name} - ${error?.message}`
      );

      return {
        url,
        emailId: data.id,
      };
    } catch (error: any) {
      console.log("SendPasswordResetError:", error.message);
      return {};
    }
  }

  async resetPassword({ verificationCode, password }: ResetPasswordParams) {
    const validCode = await this.verifiedCodeRepository.findOne({
      where: {
        idVerifiedCode: parseInt(verificationCode),
        type: verifiedCodeType.PasswordVerification,
      },
      relations: ['user']
    });

    appAssert(validCode, NOT_FOUND, "Invalid or expired verification code");
    appAssert(validCode.ExpiredAt > new Date(), NOT_FOUND, "Verification code has expired");

    const hashedPassword = await hashValue(password);
    await this.userRepository.update(validCode.user.idUser, {
      password: hashedPassword,
    });

    // Delete the verification code
    await this.verifiedCodeRepository.remove(validCode);

    const updatedUser = await this.userRepository.findOneBy({ 
      idUser: validCode.user.idUser 
    });

    return { 
      user: {
        idUser: updatedUser!.idUser,
        email: updatedUser!.email,
        fullName: updatedUser!.fullName,
      }
    };
  }
}

export default new authService();