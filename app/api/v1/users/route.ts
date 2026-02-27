import { userService } from "@/app/modules/user/user.service";
import { sendResponse } from "@/app/utils/apiRespond";
import { withErrorHndler } from "@/app/utils/withErrorHandler";

export const  GET= withErrorHndler(async() => {
        const Users = await userService.getUsers()
        return sendResponse(
            Users,
            "Users fetched successfully"
        )
});
