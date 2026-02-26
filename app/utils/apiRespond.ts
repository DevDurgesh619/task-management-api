import { NextResponse } from "next/server";

export function sendResponse<T>(
    data: T,
    message:string = 'Success',
    statusCode: number = 200
){
    return NextResponse.json({
        success:true,
        message,
        data
    },
{status: statusCode})
}