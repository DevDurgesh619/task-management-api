import { useTodoService } from "@/app/modules/todos/todo.service";
import { userService } from "@/app/modules/user/user.service";
import { sendResponse } from "@/app/utils/apiRespond";
import { withErrorHndler } from "@/app/utils/withErrorHandler";
import { requireAuth } from "@/lib/requireAuth";
import { Role } from "@prisma/client";
import { NextRequest } from "next/server";

export const GET = withErrorHndler( async (
  req: Request,
  { params }: { params: { userId: string } }
) => {
       const user = await requireAuth( [Role.USER, Role.ADMIN]);
       const { userId } =  await params;
        const result = await useTodoService.getTodos(userId)
        return sendResponse(
            {todos:result},
            "Get all todo Succesfully",
            200
        )
})
export const  DELETE = withErrorHndler( async (
  req: NextRequest,
  { params }: { params: { userId: string } }
)=>{
  const { userId } = await params
  console.log("userId in delete controller",userId)
  const deletUser = await userService.deleteUser(userId)

  return sendResponse(deletUser, "User deleted successfully", 200)
})