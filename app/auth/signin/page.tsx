"use client"
import { Role } from "@prisma/client"
import { useRouter } from "next/navigation"
import { useState } from "react"

type signinError = {
    email?:string,
    password?:string
}
export default function Signin(){
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password,setPassword]  = useState("")
    const [error,setError] = useState <signinError>({
        email:"",
        password:""
    })
    async function handleClick(){
        try{
            const res = await fetch("/api/v1/auth/signin",{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify({
                    email,
                    password,
                })
            })
            const data = await res.json();
            if(!data.success && data.errors?.fieldErrors){
                const fieldErrors = data.errors.fieldErrors
                const formateErrors:signinError = {};
                (Object.keys(fieldErrors) as (keyof signinError)[]).forEach((key)=>{
                    if(fieldErrors[key]?.[0]){
                        formateErrors[key] = fieldErrors[key]![0]
                    }
                })
                setError(formateErrors)
            }
            if(!data.success && data.errorCode  === "USER_NOT_FOUND"){
                router.push("/auth/signup")
            }
            if(data.success && data.data.role === Role.ADMIN){
                router.push("/admin-dashboard")
            }else{
                 router.push("/user-dashboard")
            }
        }catch(e){
            console.error("This is the error from signup comp, ",e)
        }
    }
    return (
        <div className=" bg-gray-100 h-auto w-auto p-5">
            <div>
             <h2>Email</h2>
            <input className="h-auto w-24 border" 
                value={email}
                onChange={(e)=> {
                    setEmail(e.target.value)
                    setError((prev)=>({...prev,email:undefined}))}}
                    >
            </input>
             {error && <div> <span className="text-red-400 font-bold text-sm">{error.email}</span></div>}
             <h2>Password</h2>
            <input className="h-auto w-24 border" 
                value={password}
                onChange={(e)=> {
                    setPassword(e.target.value)
                    setError((prev)=>({...prev,password:undefined}))}}>
            </input>
             {error && <div>  <span className="text-red-400 font-bold text-sm">{error.password}</span></div>}
             </div>
            <button className="bg-black text-white rounded hover:bg-gray-600 h-auto w-auto"
            onClick={()=>handleClick()}>
                Signup
            </button>
            
        </div>
    )
}