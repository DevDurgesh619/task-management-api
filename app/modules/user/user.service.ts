import { AppError } from "@/app/utils/errors"
import { userRepository } from "./user.repository"
export const userService ={
    async getUsers (){
        const Users = await userRepository.getAllUsers()
        if(!Users){
                    throw new AppError("Users not found",404,"USER_NOT_FOUND")
                }
                return Users
    },
    async deleteUser(userId:string){
        const deletCall = await userRepository.DleletUser(userId)
        if(!deletCall){
             throw new AppError("User not found",404,"USER_NOT_FOUND")
        }
        return deletCall
    }
}