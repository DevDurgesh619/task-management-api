import { jwtVerify } from "jose";
import { cookies } from "next/headers"
import UserClient from "./userClient";
import { requireAuth } from "@/lib/requireAuth";
import { Role } from "@prisma/client";
export default async function UserDashboard(){
    const user = await requireAuth( [Role.USER, Role.ADMIN]);
    return(
        <div>
            <UserClient name={user.name} userId={user.userId} />
        </div>
    )
}