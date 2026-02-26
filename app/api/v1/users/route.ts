import { useTodoService } from "@/app/services/todo.service";
import { userService } from "@/app/services/user.service";
import { sendResponse } from "@/app/utils/apiRespond";
import { AppError } from "@/app/utils/errors";
import prisma from "@/lib/prisma";
import { withErrorHndler } from "@/lib/withErrorHandler";
import { Role, Status } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const  GET= withErrorHndler(async() => {
        const Users = await userService.getUsers()
        return sendResponse(
            Users,
            "Users fetched successfully"
        )
});
