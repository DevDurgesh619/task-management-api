import { Status } from "@prisma/client";
import z from "zod";

export const todoSchema = z.object({
  title:z.string().min(1,"title can't be empty"),
  description: z.string().min(3,"must be at least 3 character"),
  status:z.nativeEnum(Status,"status should be enum Pending, Completed, Failed")
})