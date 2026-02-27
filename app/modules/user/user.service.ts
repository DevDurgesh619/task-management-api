import { AppError } from "@/app/utils/errors"
import { userRepository } from "./user.repository"
import { Role } from "@prisma/client"
export const userService ={
    async getUsers (role:Role){
        if(role === "ADMIN"){
            const Users = await userRepository.getAllUsers()
            if(!Users){
                throw new AppError("Users not found",404,"USER_NOT_FOUND")
            }
            return Users
        }else{
            throw new AppError("Admin Role Required",403,"FORBIDDEN")
        }
    },
    async deleteUser(userId:string,role:Role){
        if(role === "ADMIN"){
            const deletCall = await userRepository.DleletUser(userId)
        if(!deletCall){
             throw new AppError("User not found",404,"USER_NOT_FOUND")
        }
        return deletCall
        }else{
             throw new AppError("Admin Role Required",403,"FORBIDDEN")
        }
    }
}