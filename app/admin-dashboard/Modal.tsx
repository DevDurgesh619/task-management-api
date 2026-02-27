"use client"

import { apiFetch } from "@/lib/fetchWrapper"
import { useQuery, useQueryClient } from "@tanstack/react-query"

export function Modal({onClose,selectedUser}:{onClose:any,selectedUser:any}){
     const getTodos = async ()=>{
            try{
                const res = await apiFetch(`/api/v1/users/${selectedUser}`,{
                    method:"GET",
                    headers:{"Content-Type":"application/json"},
                })
                if(!res!.ok){
                    throw new Error("Error in getting todos data from be")
                }
               return await res!.json()
            }catch(e){
                console.error("This is the error :",e)
            }
        }
        const {data,error,isLoading} = useQuery({
            queryKey:["todos",selectedUser],
            queryFn:getTodos
        })
        const queryClient = useQueryClient()
        queryClient.invalidateQueries({queryKey:["todos"]})
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
         console.log("todos",data.data)
    return(
        <div className="flex justify-center items-center  min-h-screen">

        <div className="flex flex-col justify-center items-start p-5 h-64 w-96 bg-gray-100">
                {data?.data.todos.map((todo:any,i:any)=>
                <div key={todo.id} className=" flex justify-end gap-2">
                    <h2>{i} |</h2>
                    <h2>{todo.title} |</h2>
                    <h2>{todo.description} |</h2>
                    <h2>{todo.status}</h2>
                </div>)}
                 <div>
                    <button className="bg-black text-white" onClick={onClose}>Close</button>
                </div>
        </div>
        </div>
    )
}