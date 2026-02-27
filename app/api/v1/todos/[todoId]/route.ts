import { useTodoService } from "@/app/modules/todos/todo.service";
import { sendResponse } from "@/app/utils/apiRespond";
import { withErrorHndler } from "@/app/utils/withErrorHandler";

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