import prisma from "@/lib/prisma"
import { Role } from "@prisma/client"
type CreateUserInput = {
  name: string
  email: string
  password: string
  role: Role
}
export const userRepository = {

    findByEmail(email:string){
        return prisma.user.findUnique({
            where:{email}
        })
    },
    createUser(data:CreateUserInput){
        return prisma.user.create({
            select:{id:true,email:true,role:true},
            data
        })
    },
    getAllUsers(){
        return prisma.user.findMany({
             where:{
                role:Role.USER
            }
        })
    },
    findById(userId:string){
        return prisma.user.findUnique({
            where:{id:userId}
        })
    },
}