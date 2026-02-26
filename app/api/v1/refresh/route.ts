import { authService } from "@/app/modules/auth/auth.service";
import { sendResponse } from "@/app/utils/apiRespond";
import { withErrorHndler } from "@/app/utils/withErrorHandler";
import { cookies } from "next/headers";

export const POST = withErrorHndler(async ()=>{
    const refreshToken  = (await cookies()).get("refreshToken")?.value;
    const result = await authService.refresh(refreshToken!);
    (await cookies()).set("refreshToken", result.newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
        maxAge: 7 * 24 * 60 * 60
        });
        (await cookies()).set("accessToken", result.accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 1 // 15 min
          });

    return sendResponse(
            { accessToken: result.accessToken },
            "Token Refresh Successful"

            )
})