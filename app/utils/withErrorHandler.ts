import { NextResponse } from "next/server"
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import { AppError } from "./errors";

export function withErrorHndler(
    handler: Function
){
    return async (req:Request,context?:any) => {
        try{
            return await handler(req,context)
        }catch(error:any){
             // 🔹 Zod validation error
      if (error instanceof ZodError) {
        return NextResponse.json(
          {
            success: false,
            message: "Validation failed",
            errors: error.flatten()
          },
          { status: 400 }
        );
      }
            if (error instanceof Prisma.PrismaClientValidationError) {
        return NextResponse.json(
            {
            success: false,
            message: "Invalid database query",
            },
            { status: 400 }
        );
        }

            if(error instanceof AppError){
                return NextResponse.json({
                    success:false,
                    message:error.message,
                    errorCode:error.errorCode || "APP_ERROR"
                },{
                    status:error.statusCode 
                });
            }
            console.log("Unexpeted error ",error)
            return NextResponse.json({
                success:false ,
                message:"Internal Server Error",
                errorCode:"INTERNAL_ERROR"
            },{
                status:500
            })
        }
    }
}