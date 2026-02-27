import { useTodoService } from "@/app/modules/todos/todo.service";
import { todoSchema } from "@/app/modules/todos/todo.validator";
import { sendResponse } from "@/app/utils/apiRespond";
import { withErrorHndler } from "@/app/utils/withErrorHandler";
import { requireAuth } from "@/lib/requireAuth";
import { Role } from "@prisma/client";
import { jwtVerify } from "jose";
import { NextRequest } from "next/server";

export  const  DELETE = withErrorHndler( async (
  req: Request,
  { params }: { params: { todoId: string } }
) => {
    const { todoId } =  await params;
    console.log("todoId in controller",todoId)
    const dltTodo = await useTodoService.deleteTodo(todoId)
    return sendResponse({
        dltTodo},
        "Todo deleted successfully",       
    )
})
export const  PUT = withErrorHndler( async (
  req: NextRequest,
  { params }: { params: { todoId: string } }
) => {
   const {todoId} = await params;
  console.log("todoId in put controller",todoId)
const user = await requireAuth( [Role.USER, Role.ADMIN]);
  const data = await req.json();
  const parsed = todoSchema.parse(data)
  console.log("todoId in put controller",todoId)
  const updated = await useTodoService.updateTodo(parsed,user.userId,todoId)
  return sendResponse(updated, "Todo updated successfully", 200);
})

