import { jwtVerify } from "jose";
import { cookies } from "next/headers"
import UserClient from "./userClient";
export default async function UserDashboard(){
    
    return(
        <div>
            <UserClient  />
        </div>
    )
}