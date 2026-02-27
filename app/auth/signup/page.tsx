"use client"

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
    const [error,setError] = useState<FormErrors>({})
    const router = useRouter()

    async function handleClick(){
        try{
            const res = await fetch("/api/v1/auth/signup",{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify({
                    email,
                    name,
                    password
                })
            })

            const data = await res.json()

            if (!data.success && data.errors?.fieldErrors) {
                const fieldErrors = data.errors.fieldErrors
                const formattedErrors: FormErrors = {};

                (Object.keys(fieldErrors) as (keyof FormErrors)[]).forEach((key) => {
                    if (fieldErrors[key]?.[0]) {
                        formattedErrors[key] = fieldErrors[key][0]
                    }
                })

                setError(formattedErrors)
                return
            }

            if(data.success){
                router.push("/auth/signin")
            }

        }catch(e){
            console.error("Signup error:", e)
        }
    }

    return (
        <div className="bg-gray-100 min-h-screen flex items-center justify-center">
            <div className="bg-white p-6 rounded shadow-md w-80">
                
                <h1 className="text-xl font-bold mb-4 text-center">Create Account</h1>

                <div className="mb-3">
                    <label>Name</label>
                    <input
                        className="w-full border p-2 rounded"
                        value={name}
                        onChange={(e)=> {
                            setName(e.target.value)
                            setError((prev) => ({ ...prev, name: undefined }))
                        }}
                    />
                    {error.name && (
                        <p className="text-red-500 text-sm">{error.name}</p>
                    )}
                </div>

                <div className="mb-3">
                    <label>Email</label>
                    <input
                        className="w-full border p-2 rounded"
                        value={email}
                        onChange={(e)=> {
                            setEmail(e.target.value)
                            setError((prev) => ({ ...prev, email: undefined }))
                        }}
                    />
                    {error.email && (
                        <p className="text-red-500 text-sm">{error.email}</p>
                    )}
                </div>

                <div className="mb-4">
                    <label>Password</label>
                    <input
                        type="password"
                        className="w-full border p-2 rounded"
                        value={password}
                        onChange={(e)=> {
                            setPassword(e.target.value)
                            setError((prev) => ({ ...prev, password: undefined }))
                        }}
                    />
                    {error.password && (
                        <p className="text-red-500 text-sm">{error.password}</p>
                    )}
                </div>

                <button
                    className="w-full bg-black text-white py-2 rounded hover:bg-gray-700"
                    onClick={handleClick}
                >
                    Sign Up
                </button>

                <p className="text-sm text-center mt-4">
                    Already have an account?{" "}
                    <span
                        onClick={() => router.push("/auth/signin")}
                        className="text-blue-600 cursor-pointer hover:underline"
                    >
                        Sign in
                    </span>
                </p>

            </div>
        </div>
    )
}
