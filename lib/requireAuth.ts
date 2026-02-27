import { jwtVerify } from "jose";
import { NextRequest } from "next/server";
import { Role } from "@prisma/client";
import { cookies } from "next/headers";

type AuthUser = {
  userId: string;
  role: Role;
  name:string
};

export async function requireAuth(
  allowedRoles?: Role[]
): Promise<AuthUser> {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

  const accessToken = await (await cookies()).get("accessToken")?.value

  if (!accessToken) {
    throw new Error("Unauthorized");
  }

  const { payload } = await jwtVerify(accessToken, secret);

  const user = {
    userId: payload.sub as string,
    role: payload.role as Role,
    name: payload.Name as string
  };

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    throw new Error("Forbidden");
  }

  return user;
}
