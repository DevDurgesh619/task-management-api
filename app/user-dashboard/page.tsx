import { jwtVerify } from "jose";
import { cookies } from "next/headers"
import UserClient from "./userClient";
import { useAuthStore } from "../zustandStore/auth.store";

export default async function UserDashboard(){
    
    return(
        <div>
            <UserClient  />
        </div>
    )
}