import { authService } from "@/app/modules/auth/auth.service";
import { sendResponse } from "@/app/utils/apiRespond";
import { AppError } from "@/app/utils/errors";
import { withErrorHndler } from "@/app/utils/withErrorHandler";
import { cookies } from "next/headers";
export const dynamic = "force-dynamic";
export const POST = withErrorHndler(async ()=>{
   const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refreshToken")?.value;
    if (!refreshToken) {
        throw new AppError("No refresh token provided",400);
    }
    const result = await authService.refresh(refreshToken!);
    cookieStore.set("refreshToken", result.newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
        maxAge: 7 * 24 * 60 * 60
        });
        cookieStore.set("accessToken", result.accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 10 // 15 min
          });

    return sendResponse(
            { accessToken: result.accessToken },
            "Token Refresh Successful"

            )
})