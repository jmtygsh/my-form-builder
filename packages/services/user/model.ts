import { z } from "zod";

export const createUserWithEmailAndPasswordInput = z.object({
  fullName: z.string().describe("full name of the user"),
  email: z.email({ message: "Invalid email address" }).describe("email address of the user"),
  password: z.string().describe("password of the user"),
});
export type createUserWithEmailAndPasswordInputType = z.infer<typeof createUserWithEmailAndPasswordInput>;


export const generateUserTokenPayload = z.object({
  id: z.string().describe("uuid of the user")
})
export type generateUserTokenPayloadType = z.infer<typeof generateUserTokenPayload>;


export const signInUserWithEmailAndPasswordInput = z.object({
  email: z.email().describe('email of the user'),
  password: z.string().describe('password of the user')
})
export type signInUserWithEmailAndPasswordInputType = z.infer<typeof signInUserWithEmailAndPasswordInput>;


