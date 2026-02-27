import { Status } from "@prisma/client"
import { AppError } from "@/app/utils/errors"
import { todoRepository } from "./todo.repository"

export const useTodoService = {
    async createTodo(data:any,userId:any){
        type FORM = {
                title:string,
                description:string,
                status:Status,
            }
            const form:FORM = {
                title:data.title,
                description:data.description,
                status:data.status,
            }
        const todo = await todoRepository.create_TODO(form,userId)
         if(!todo){
                 throw new AppError("Todo not created",404,"TODO_NOT_CREATED")
         }
        return todo
    },
    async getTodos(userId:string){
        const todos = await todoRepository.findTodos(userId)
        if(!todos){
            throw new AppError("Error in getting todos from DB",404,"GET_TODO_PRISMA_ERROR")
        }
        return todos
    },
    async deleteTodo(todoId:string){
        console.log("todoId in service",todoId)
        const dltTodo = await todoRepository.deleteTODO(todoId)
        if(!dltTodo){
            throw new AppError("Failed to delete todo",500,"FAILED_TO_DELETE_TODO")
        }
        return dltTodo
    }
}