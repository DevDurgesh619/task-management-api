import { Status } from "@prisma/client";
import { title } from "process";
import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  secretKey: z.string().optional()
});
export const signinSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  secretKey: z.string().optional()
});
