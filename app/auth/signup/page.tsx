"use client"
import { Role } from "@prisma/client"
import { useRouter } from "next/navigation"
import { useState } from "react"

type FormErrors = {
  name?: string;
  email?: string;
  password?: string;
};

export default function Signup(){
    const [name,setName] = useState("")
    const [email, setEmail] = useState("")
    const [password,setPassword]  = useState("")
    const [secretKey,setSecretKey] = useState("")
    const [error,setError] = useState <FormErrors>({
        email:"",
        name:"",
        password:"",
    })
    const router = useRouter()
    async function handleClick(){
        try{
            const res = await fetch("/api/v1/auth/signup",{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify({
                    email,
                    name,
                    password,
                    secretKey
                })
            })
            const data = await res.json()
            if (!data.success && data.errors?.fieldErrors) {
            const fieldErrors = data.errors.fieldErrors;

            const formattedErrors: FormErrors = {};

            (Object.keys(fieldErrors) as (keyof FormErrors)[]).forEach((key) => {
                if (fieldErrors[key]?.[0]) {
                formattedErrors[key] = fieldErrors[key]![0];
                }
            });

            setError(formattedErrors);
            }

            console.log(error)
            if(data.success){
                router.push("/auth/signin")
            }
        }catch(e){
            console.error("This is the error from signup comp, ",e)
        }
    }
    return (
        <div className=" bg-gray-100 h-auto w-auto p-5">
            <div>
            <h2>Name</h2>
            <input className="h-auto w-24 border" 
                value={name}
                onChange={(e)=> {
                    setName(e.target.value)
                    setError((prev) => ({ ...prev, name: undefined }))}}>
            </input>
            {error && <div> name Error: <span className="text-red-400 font-bold text-sm">{error.name}</span></div>}
             <h2>Email</h2>
            <input className="h-auto w-24 border" 
                value={email}
                onChange={(e)=> {
                    setEmail(e.target.value)
                    setError((prev) => ({ ...prev, email: undefined }))}}>
            </input>
            {error && <div> Email Error: <span className="text-red-400 font-bold text-sm">{error.email}</span></div>}
             <h2>Password</h2>
            <input className="h-auto w-24 border" 
                value={password}
                onChange={(e)=> {
                    setPassword(e.target.value)
                    setError((prev) => ({ ...prev, password: undefined }))}}>
            </input>
            {error && <div> password Error: <span className="text-red-400 font-bold text-sm">{error.password}</span></div>}
             <h2>AdminSecret</h2>
            <input className="h-auto w-24 border" 
                value={secretKey}
                onChange={(e)=> setSecretKey(e.target.value)}>
            </input>
             </div>
            <button className="bg-black text-white rounded hover:bg-gray-600 h-auto w-auto"
            onClick={()=>handleClick()}>
                Signin
            </button>
            
        </div>
    )
}