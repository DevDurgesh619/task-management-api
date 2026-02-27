import { authService } from "@/app/modules/auth/auth.service";
import { signinSchema } from "@/app/modules/auth/auth.validator";
import { sendResponse } from "@/app/utils/apiRespond";
import { AppError } from "@/app/utils/errors";
import { withErrorHndler } from "@/app/utils/withErrorHandler";
import { getClientIP } from "@/lib/getClientIp";
import prisma from "@/lib/prisma";
import { rateLimit } from "@/lib/rateLimiter";
import { Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const  POST = withErrorHndler(async (req:NextRequest) => {
        const data = await req.json()
        const ip = getClientIP(req);
        const parsed = signinSchema.parse(data)
        rateLimit(ip, 5, 60000);
        const result = await authService.signInRegister(parsed);
        (await cookies()).set("refreshToken",result.refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            path: "/",
            maxAge: 7 * 24 * 60 * 60
            });
           (await cookies()).set("accessToken", result.accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 10 // 15 min
          })
       return sendResponse(
        { role:result.user.role},
         "Login successful"
       )
    
})