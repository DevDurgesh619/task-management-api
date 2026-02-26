import { NextRequest } from "next/server";

export function getClientIP(req: NextRequest) {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  return "unknown";
}
