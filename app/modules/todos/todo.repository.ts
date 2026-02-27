import prisma from "@/lib/prisma"

export const todoRepository = {
    async create_TODO(form:any,userId:any){
        return await prisma.task.create({
                    data:{
                        title:form.title,
                        description:form.description,
                        status:form.status,
                        userId:userId
                    }
                })
    },
    async findTodos(userId:string){
        return await prisma.task.findMany({
            where:{
                userId
            },
        })
    },
    async deleteTODO(todoId:string){
        console.log("todoID reache to db call",todoId)
        return await prisma.task.delete({
            where:{
                id:todoId
            }
        })
    },
    async findTodo(userId:string,todoId:string){
        return await prisma.task.findFirst({
        where: {
        id:todoId,
        userId,
        },
    });
    },
    async updateTodo(data:any,todoId:string){
        console.log("todoId in put db call",todoId)
        return await prisma.task.update({
        where: {
        id: todoId,
        },
        data,
    });

    }
}