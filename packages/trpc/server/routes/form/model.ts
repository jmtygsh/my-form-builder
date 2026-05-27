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



// common type for input & output
export const formDraftSchema = z.object({
    name: z.string(),
    rows: z.array(z.object({
        id: z.string(),
        fields: z.array(z.object({
            id: z.string(),
            type: z.string(),
            props: z.record(z.string(), z.any()),
        }))
    }))
});

export const saveDraftFormInputModel = z.object({
    formId: z.string().describe("uuid of the form"),
    draft: formDraftSchema.describe("json representation of the draft builder state"),
})

export const saveDraftFormOutputModel = z.object({
    id: z.string(),
})



export const loadDraftedFormInputModel = z.object({
    formId: z.string().describe("uuid of the form")
})

export const loadDraftedFormOutputModel = z.object({
    draft: formDraftSchema.nullable(),
})



export const publishFormInputModel = z.object({
    formId: z.string().describe("uuid of the form"),
    data: formDraftSchema.describe("json representation of the data builder state"),
    settings: z.object({
        visibility: z.enum(["public", "unlisted", "unpublished"]),
        protected: z.boolean(),
        password: z.string().optional(),
        expiryEnabled: z.boolean(),
        expiryDate: z.string().optional(),
        allowAnonymous: z.boolean(),
        maxResponses: z.string().optional(),
    }).describe("publish settings for the form"),
})

export const publishFormOutputModel = z.object({
    slug: z.string(),
});


export const getFormBySlugInputModel = z.object({
    slug: z.string().describe("slug of the form")
});

export const getFormBySlugOutputModel = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string().nullable(),
    isProtected: z.boolean(),
    published: formDraftSchema.nullable(),
});

export const verifyFormPasswordInputModel = z.object({
    slug: z.string().describe("slug of the form"),
    password: z.string().describe("password to unlock the form")
});

export const verifyFormPasswordOutputModel = z.object({
    published: formDraftSchema.nullable(),
});

export const submitFormResponseInputModel = z.object({
    formId: z.string().describe("uuid of the form"),
    answers: z.record(z.string(), z.any()).describe("answers submitted by the respondent"),
});

export const submitFormResponseOutputModel = z.object({
    id: z.string(),
});


