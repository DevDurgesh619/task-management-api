import { authService } from "@/app/modules/auth/auth.service";
import { registerSchema } from "@/app/modules/auth/auth.validator";
import { sendResponse } from "@/app/utils/apiRespond";
import { AppError } from "@/app/utils/errors";
import { withErrorHndler } from "@/app/utils/withErrorHandler";
import { getClientIP } from "@/lib/getClientIp";
import prisma from "@/lib/prisma";
import { rateLimit } from "@/lib/rateLimiter";
import { Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export const POST = withErrorHndler(async(req:NextRequest) => {
         const ip = getClientIP(req);
         rateLimit(ip, 5, 60000);
        const body = await req.json()
        const parsed = registerSchema.parse(body);
        const user = await authService.register(parsed)

        return sendResponse(
            user,
            "User created successfully",
            201
        )
})