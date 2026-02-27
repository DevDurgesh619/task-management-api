import { userService } from "@/app/modules/user/user.service";
import { sendResponse } from "@/app/utils/apiRespond";
import { withErrorHndler } from "@/app/utils/withErrorHandler";
import { requireAuth } from "@/lib/requireAuth";
import { Role } from "@prisma/client";

export const  GET= withErrorHndler(async() => {
    const user = await requireAuth( [Role.USER, Role.ADMIN]);

        const Users = await userService.getUsers(user.role)
        return sendResponse(
            Users,
            "Users fetched successfully"
        )
});
