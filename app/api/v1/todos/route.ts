import { sendResponse } from "@/app/utils/apiRespond";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/requireAuth";
import { Role } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { withErrorHndler } from "@/app/utils/withErrorHandler";
import { useTodoService } from "@/app/modules/todos/todo.service";
import { todoSchema } from "@/app/modules/todos/todo.validator";

export const POST = withErrorHndler( async (req:NextRequest) =>{
    const user = await requireAuth( [Role.USER, Role.ADMIN]);
    const data = await req.json();
    const parsed = todoSchema.parse(data)
    const todo = await useTodoService.createTodo(parsed,user.userId)
        return sendResponse(
            todo,
            "Todo Created"
        ) 
})