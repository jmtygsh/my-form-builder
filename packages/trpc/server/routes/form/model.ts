import { z } from "zod";


export const createNewFormInputModel = z.object({
    title: z.string().describe("title of the form"),
    description: z.string().optional().describe("description of the form"),
})

export const createNewFormOutputModel = z.object({
    id: z.string().describe("ID of the form"),
    slug: z.string().describe("slug of the form"),
});



export const getFormDisplayListInputModel = z.undefined()
export const getFormDisplayListOutputModel = z.array(z.object({
    id: z.string(),
    title: z.string(),
    description: z.string().nullable(),
    slug: z.string(),
}));