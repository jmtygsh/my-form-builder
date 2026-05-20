import { z } from "zod";

export const createUserWithEmailAndPasswordInputModel = z.object({
    fullName: z.string().describe("Full name of the user"),
    email: z.email().describe("Email of the user"),
    password: z.string().min(6).describe("Password of the user"),
});

export const createUserWithEmailAndPasswordOutputModel = z.object({
    id: z.string().describe("ID of the user"),
});



export const signInUserWithEmailAndPasswordInputModel = z.object({
    email: z.email().describe('email of the user'),
    password: z.string().describe('password of the user')
})

export const signInUserWithEmailAndPasswordOutputModel = z.object({
    id: z.string().describe("ID of the user"),
});


export const getLoggerInUserInfoInputModel = z.undefined();

export const getLoggerInUserInfoOutput = z.object({
    id: z.string().describe("ID of the user"),
    email: z.email().describe('email of the user'),
    fullName: z.string().describe("Full name of the user"),
    profileImageUrl: z.string().describe("image of the user").optional().nullable()
})



export const verifyUserEmailWithTokenInputModel = z.object({
    token: z.string().describe("Token to verify user email"),
})

export const verifyUserEmailWithTokenOutputModel = z.object({
    id: z.string().describe("ID of the user"),
})


export const forgetPasswordInputModel = z.object({
    email: z.email().describe("Email of the user"),
})
export const forgetPasswordOutputModel = z.object({
    message: z.string().describe("Message to show to the user"),
})

export const resetPasswordInputModel = z.object({
    token: z.string().describe("Reset password token"),
    password: z.string().min(6).describe("New password for the user"),
})
export const resetPasswordOutputModel = z.object({
    id: z.string().describe("ID of the user"),
})