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
    }
}