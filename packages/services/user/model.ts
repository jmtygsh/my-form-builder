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



// forms 
export const createFormDisplayInput = z.object({
  userId: z.string().describe("uuid of the user"),
  title: z.string().describe("title of the form"),
  description: z.string().optional().describe("description of the form"),
})
export type createFormDisplayInputType = z.infer<typeof createFormDisplayInput>;



export const getFormDisplayListInput = z.object({
  userId: z.string().describe("uuid of the user"),
})
export type getFormDisplayListInputType = z.infer<typeof getFormDisplayListInput>;



// form draft common 
export const formDraftSchema = z.object({
  name: z.string(),
  props: z.record(z.string(), z.any()).optional(),
  rows: z.array(z.object({
    id: z.string(),
    props: z.record(z.string(), z.any()).optional(),
    fields: z.array(z.object({
      id: z.string(),
      type: z.string(),
      props: z.record(z.string(), z.any()),
    }))
  }))
});


// save drafted form 
export const saveDraftFormInput = z.object({
  formId: z.string().describe("uuid of the form"),
  draft: formDraftSchema.describe("json representation of the draft builder state"),
})
export type saveDraftFormInputType = z.infer<typeof saveDraftFormInput>;

// get drafted form
export const loadDraftedFormInput = z.object({
  formId: z.string().describe("uuid of the form")
})
export type loadDraftedFormInputType = z.infer<typeof loadDraftedFormInput>;


// derfated to publish
export const publishFormInput = z.object({
  formId: z.string().describe("uuid of the form"),
  data: formDraftSchema.describe("json representation of the publish state"),
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
export type publishFormInputType = z.infer<typeof publishFormInput>;

export const getFormBySlugInput = z.object({
  slug: z.string().describe("slug of the form")
});
export type getFormBySlugInputType = z.infer<typeof getFormBySlugInput>;

export const verifyFormPasswordInput = z.object({
  slug: z.string().describe("slug of the form"),
  password: z.string().describe("password to unlock the form")
});
export type verifyFormPasswordInputType = z.infer<typeof verifyFormPasswordInput>;

export const submitFormResponseInput = z.object({
  formId: z.string().describe("uuid of the form"),
  answers: z.record(z.string(), z.union([z.string(), z.array(z.string())])).describe("answers submitted by the respondent"),
});
export type submitFormResponseInputType = z.infer<typeof submitFormResponseInput>;

export const getFormResponsesInput = z.object({
  formId: z.string().describe("uuid of the form"),
  userId: z.string().describe("uuid of the user"),
});
export type getFormResponsesInputType = z.infer<typeof getFormResponsesInput>;

//end form draft common 



