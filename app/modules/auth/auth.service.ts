import { AppError } from "@/app/utils/errors";
import { userRepository } from "../user/user.repository";
import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";
import { SignJWT } from "jose";
import { authRepository } from "./auth.repository";

export const authService ={
async register(data:any){
             const existing = await userRepository.findByEmail(data.email)
            
            if (existing) {
                throw new AppError("User already exists", 400, "USER_ALREADY_EXISTS");
            }
            const salt = 10 
            const hasedPassword = await bcrypt.hash(data.password,salt)
            const role =
                data.secretKey &&
                data.secretKey === process.env.ADMIN_SECRET
                    ? Role.ADMIN
                    : Role.USER;
                    
           return userRepository.createUser({
            name: data.name,
            email: data.email,
            password: hasedPassword,
            role
            }
           )
},
async signInRegister (data:any){
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
            const exestingUser = await userRepository.findByEmail(data.email)
            if(!exestingUser){
                throw new AppError("User not found", 404, "USER_NOT_FOUND")
            }
            const isPasswordValid = await bcrypt.compare(
                data.password,
                exestingUser.password
            )
            if(!isPasswordValid){
                throw new AppError("Invalid credentials", 401, "INVALID_CREDENTIALS");
            }
            async function createToken(email:any,role:any,name:any) {
            const jwt = await new SignJWT({
                email,role,sub:exestingUser?.id,Name:name
            })
                .setProtectedHeader({ alg: 'HS256' })
                .setIssuedAt()
                .setExpirationTime('15m') 
                .sign(secret);
            
            return jwt;
            }
            const accessToken = await createToken(data.email,exestingUser.role,exestingUser.name);
            const refreshToken = crypto.randomUUID()
           await authRepository.create_RefreshToken(refreshToken,exestingUser.id);
            return {
                user:{
                    id:exestingUser.id,
                    role:exestingUser.role
                },
                accessToken,
                refreshToken
            }
},
async refresh(refreshToken: string){
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const existing = await authRepository.findToken(refreshToken)
    if (!existing || existing.revoked || existing.expiresAt < new Date()) {
    throw new AppError("Invalid or expired refresh token", 401, "INVALID_TOKEN")
}

    const rotate  = await authRepository.updateToken(existing.id)
    const newRefreshToken = crypto.randomUUID()
    const saveNewToken = await authRepository.create_RefreshToken(newRefreshToken,existing.userId)
    const exestingUser = await userRepository.findById(existing.userId)
    async function createToken(email:any,role:any,name:any) {
            const jwt = await new SignJWT({
                email,role,sub:exestingUser?.id,Name:name
            })
                .setProtectedHeader({ alg: 'HS256' })
                .setIssuedAt()
                .setExpirationTime('15m') 
                .sign(secret);
            
            return jwt;
            }
    const accessToken = await createToken(exestingUser?.email,exestingUser?.role,exestingUser?.name);
    return {
        accessToken,
        newRefreshToken
    }
}

}