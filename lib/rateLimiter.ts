import { AppError } from "../app/utils/errors";

const rateLimitMap = new Map<string,{count:number,lastRequest:number}>()
export function rateLimit(ip:any,limit = 10,windowMs = 60000){

const now   = Date.now();
const entry = rateLimitMap.get(ip);
if(!entry){
    rateLimitMap.set(ip,{count:1,lastRequest:now})
    return 
}
if(now - entry.lastRequest > windowMs){
    rateLimitMap.set(ip,{count:1,lastRequest:now})
    return  
}
if(entry.count >= limit){
    throw new AppError("Too many requests",429 ,"TO_MANY_REQUEST");
}
entry.count++


}