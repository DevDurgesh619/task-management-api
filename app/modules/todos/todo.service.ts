import { Status } from "@prisma/client"
import { todoRepository } from "../modules/todos/todo.repository"
import { AppError } from "@/app/utils/errors"

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
    }
}