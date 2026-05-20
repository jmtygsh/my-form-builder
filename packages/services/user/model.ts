import { z } from "zod";

export const createUserWithEmailAndPasswordInput = z.object({
  fullName: z.string().describe("full name of the user"),
  email: z.email({ message: "Invalid email address" }).describe("email address of the user"),
  password: z.string().describe("password of the user"),
});
export type createUserWithEmailAndPasswordInputType = z.infer<typeof createUserWithEmailAndPasswordInput>;


export const generateUserTokenPayloadInput = z.object({
  id: z.string().describe("uuid of the user")
})
export type generateUserTokenPayloadInputType = z.infer<typeof generateUserTokenPayloadInput>;


export const signInUserWithEmailAndPasswordInput = z.object({
  email: z.email().describe('email of the user'),
  password: z.string().describe('password of the user')
})
export type signInUserWithEmailAndPasswordInputType = z.infer<typeof signInUserWithEmailAndPasswordInput>;



export const verifyUserEmailWithTokenInput = z.object({
  token: z.string().describe("token to verify the user email")
})
export type verifyUserEmailWithTokenInputType = z.infer<typeof verifyUserEmailWithTokenInput>;



export const forgetPasswordInput = z.object({
  email: z.email().describe("Email of the user")
})
export type forgetPasswordInputType = z.infer<typeof forgetPasswordInput>;



export const resetPasswordInput = z.object({
  token: z.string().describe("token to reset the password"),
  password: z.string().describe("new password")
})
export type resetPasswordInputType = z.infer<typeof resetPasswordInput>;
