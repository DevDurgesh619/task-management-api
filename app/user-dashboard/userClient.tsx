"use client"

import { apiFetch } from "@/lib/fetchWrapper"
import { Status } from "@prisma/client"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
type todoError ={
    title?:string,
    description?:string,
    status?:string
}
export default function UserClient(){
    type FORM = {
        title:string,
        description:string,
        status:Status,
    }
        const [form,setForm] = useState<FORM>({title:"",description:"",status:Status.PENDING})
        const [todoError, setTodoError] = useState <todoError>({
            title:"",
            description:"",
            status:""
        })
         const queryClient = useQueryClient()
        const handleDelete = async (todoId: string) => {
        try {
            const res = await apiFetch(`/api/v1/todos/${todoId}`, {
            method: "DELETE",
            });

            if (!res!.ok) {
            throw new Error("Failed to delete");
            }

            console.log("Deleted successfully");
            queryClient.invalidateQueries({queryKey:["todos"]})
        } catch (error) {
            console.error(error);
        }
        };

        const getTodos = async ()=>{
            try{
                const res = await apiFetch("/api/v1/todos",{
                    method:"GET",
                    headers:{"Content-Type":"application/json"},
                })
                
               return await res!.json()
            }catch(e){
                console.error("This is the error :",e)
            }
        }
        const {data,error,isLoading} = useQuery({
            queryKey:["todos"],
            queryFn:getTodos
        })

        const mutation = useMutation({
            mutationFn: async () => {
                const res = await apiFetch("/api/v1/todos", {
                method: "POST",
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify(form),
                })
                const data = await res?.json();
                if( !data.success && data.errors.fieldErrors){
                    const fieldErrors = data.errors.fieldErrors
                    const todoErrorFormate:todoError = {};
                    (Object.keys(fieldErrors) as (keyof todoError)[]).forEach((key)=>{
                        if(fieldErrors[key]?.[0]){
                            todoErrorFormate[key] = fieldErrors[key]?.[0]
                        }
                    })
                    setTodoError(todoErrorFormate)
                }
                if (!res!.ok) throw new Error("server error")
                    setForm({title:"",description:"",status:Status.PENDING})
            },
            onSuccess:()=>{
                queryClient.invalidateQueries({queryKey:["todos"]})
            }
         })
         if(isLoading){
            return(
                <div>
                    Loading....
                </div>
            )
         }
         if(error){
            return <div> there is error in getting data</div>
         }
    return(
        <div className="flex flex-col justify-center items-start gap-5 p-3">
            <div className="flex justify-center items-center gap-4">
                <input className=" border h-auto w-24 " 
                 placeholder="title.."
                value={form.title}
                onChange={(e)=>{
                    setForm({...form,title:e.target.value})
                    setTodoError((prev)=>({...prev,title:undefined}))}}>
                </input>
                {todoError && <div> <span className="text-red-400 font-bold text-sm">{todoError.title}</span></div>}
                <input className=" border h-auto w-24 " 
                placeholder="description.."
                value={form.description}
                onChange={(e)=>{
                    setForm({...form,description:e.target.value})
                    setTodoError((prev)=>({...prev,description:undefined}))}}>
                </input>
                {todoError && <div> <span className="text-red-400 font-bold text-sm">{todoError.description}</span></div>}
                <select  value={form.status} onChange={(e)=>setForm({...form,status:e.target.value as Status})}>
                    <option value={Status.PENDING}>
                        PENDING
                    </option>
                     <option value={Status.FAILED}>
                        FAILED
                    </option>
                     <option value={Status.COMPLETED}>
                        COMPLETE
                    </option>
                </select>
                {todoError && <div> <span className="text-red-400 font-bold text-sm">{todoError.status}</span></div>}
            </div>
            <div>
                <button className="h-auto w-auto rounded bg-black text-white hover:bg-gray-500 ml-2"
                onClick={()=>mutation.mutate()}>
                    Add To-Do
                </button>
            </div>
            <div className=" space-y-2">
                {data?.data.todos?.map((todo:any,i:any)=> <div key={todo.id} className=" flex gap-2">
                    <h2>{i} |</h2>
                    <h2>{todo.title} |</h2>
                    <h2>{todo.description} |</h2>
                    <h2>{todo.status}</h2>
                    <button className="bg-black text-white rounded hover:bg-gray-500 " onClick={() => handleDelete(todo.id)}>
                    Delete
                    </button>
                </div>)}
            </div>
        </div>
    )
}