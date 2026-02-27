import { sendResponse } from "@/app/utils/apiRespond";
import { withErrorHndler } from "@/app/utils/withErrorHandler";

export  const  POST = withErrorHndler( async(req:Request)=> {
const response = sendResponse(
    null,
    "Logged out successfully",
    200
);
  response.cookies.set("accessToken", "", {
    httpOnly: true,
    expires: new Date(0), 
    path: "/",
  });

  return response;
})

