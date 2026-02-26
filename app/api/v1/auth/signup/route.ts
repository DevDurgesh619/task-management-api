import { authService } from "@/app/modules/auth/auth.service";
import { registerSchema } from "@/app/modules/auth/auth.validator";
import { sendResponse } from "@/app/utils/apiRespond";
import { AppError } from "@/app/utils/errors";
import prisma from "@/lib/prisma";
import { withErrorHndler } from "@/lib/withErrorHandler";
import { Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export const POST = withErrorHndler(async(req:NextRequest) => {
        const body = await req.json()
        const parsed = registerSchema.parse(body);
        const user = await authService.register(parsed)

        return sendResponse(
            user,
            "User created successfully",
            201
        )
})