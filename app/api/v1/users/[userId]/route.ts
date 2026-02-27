import { useTodoService } from "@/app/modules/todos/todo.service";
import { sendResponse } from "@/app/utils/apiRespond";
import { withErrorHndler } from "@/app/utils/withErrorHandler";
import { requireAuth } from "@/lib/requireAuth";
import { Role } from "@prisma/client";

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