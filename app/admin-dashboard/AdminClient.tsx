"use client"

import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { Modal } from "./Modal"
import { apiFetch } from "@/lib/fetchWrapper"

export function AdminClient(){
    const [selectedUser,setSelectedUser]=useState("")
    const [modalOpen,setModalOpen] = useState(false)
    const getUsers = async ()=>{
        const res = await apiFetch("/api/v1/users",{
            method:"GET",
            headers:{"Content-Type":"application/json"}
        })
        if(!res!.ok){
            throw new Error("NOT getting users list")
        }
        return await res!.json()
    }
    const usersQuery = useQuery({
        queryKey:["users"],
        queryFn:getUsers
    })
    const queryClient = useQueryClient()
        queryClient.invalidateQueries({queryKey:["users"]})
     if(usersQuery.isLoading){
            return(
                <div>
                    Loading....
                </div>
            )
         }
         if(usersQuery.error){
            return <div> there is error in getting data</div>
         }
    return(
        <div>
            {modalOpen ?<div>
                <Modal onClose={()=>setModalOpen(false)} selectedUser={selectedUser} />
            </div> :
            <div className="flex flex-col gap-2 p-2">
            {usersQuery.data.data.map((user:any,i:any)=> <div key={user.id} className=" flex gap-2 bg-amber-300" onClick={()=>{
                setSelectedUser(user.id)
                setModalOpen(true)
            }}>
                <h3>{i}</h3>
                 <h3>{user.name}</h3>
                  <h3>{user.email}</h3>
            </div>)}
        </div>}
        </div>
    )
}