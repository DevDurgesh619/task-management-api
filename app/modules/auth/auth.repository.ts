import prisma from "@/lib/prisma"

export const authRepository = {
    async create_RefreshToken(token:any,userId:any){
         await prisma.refreshToken.create({
           data: {
            token: token,
            userId:userId,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        }
        })
    },
    async findToken (refreshToken:any){
        return await prisma.refreshToken.findUnique({
            where:{
                token:refreshToken
            }
        })
    },
    async updateToken (id:any){
        return await prisma.refreshToken.update({
            where:{
                id:id
            },
            data:{
                revoked:true
            }
        })
    }

}