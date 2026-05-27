import { userService } from "../../services";


import { protectedProcedure, publicProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import { z } from "zod";
import { createNewFormInputModel, createNewFormOutputModel, getFormDisplayListInputModel, getFormDisplayListOutputModel, loadDraftedFormInputModel, loadDraftedFormOutputModel, publishFormInputModel, publishFormOutputModel, saveDraftFormInputModel, saveDraftFormOutputModel, formDraftSchema, getFormBySlugInputModel, getFormBySlugOutputModel, verifyFormPasswordInputModel, verifyFormPasswordOutputModel, submitFormResponseInputModel, submitFormResponseOutputModel, getFormResponsesInputModel, getFormResponsesOutputModel, deleteFormInputModel, deleteFormOutputModel, getTrashedFormsOutputModel } from "./model";

const TAGS = ["Form"];
const getPath = generatePath("/form");

export const formRouter = router({

    createNewForm: protectedProcedure
        .meta({ openapi: { method: "POST", path: getPath("/create-new-form"), tags: TAGS } })
        .input(createNewFormInputModel)
        .output(createNewFormOutputModel)
        .mutation(async ({ input, ctx }) => {
            const { title, description } = input;
            const { id, slug } = await userService.createFormDisplay({ userId: ctx.user.id as string, title, description });
            return {
                id,
                slug
            };
        }),


    // showing all forms found 
    getFormDisplayList: protectedProcedure
        .meta({ openapi: { method: "GET", path: getPath("/get-form-display-list"), tags: TAGS } })
        .input(getFormDisplayListInputModel)
        .output(getFormDisplayListOutputModel)
        .query(async ({ ctx }) => {
            const forms = await userService.getFormDisplayList({ userId: ctx.user.id as string });
            return forms;
        }),


    saveDraftForm: protectedProcedure
        .meta({ openapi: { method: "POST", path: getPath("/save-draft-form"), tags: TAGS } })
        .input(saveDraftFormInputModel)
        .output(saveDraftFormOutputModel)
        .mutation(async ({ input }) => {
            const result = await userService.saveDraftForm(input);
            return { id: result.id };
        }),


    loadDraftedForm: protectedProcedure
        .meta({ openapi: { method: "GET", path: getPath("/get-drafted-form"), tags: TAGS } })
        .input(loadDraftedFormInputModel)
        .output(loadDraftedFormOutputModel)
        .query(async ({ input }) => {
            const result = await userService.loadDraftedForm(input);
            return {
                draft: result.draft
            }
        }),


    publishForm: protectedProcedure
        .meta({ openapi: { method: "POST", path: getPath("/publish-form"), tags: TAGS } })
        .input(publishFormInputModel)
        .output(publishFormOutputModel)
        .mutation(async ({ input }) => {
            const result = await userService.publishForm(input);
            return { slug: result.slug };
        }),

    getFormBySlug: publicProcedure
        .meta({ openapi: { method: "GET", path: getPath("/getFormBySlug"), tags: TAGS } })
        .input(getFormBySlugInputModel)
        .output(getFormBySlugOutputModel)
        .query(async ({ input }) => {
            const result = await userService.getFormBySlug(input);
            return result;
        }),

    verifyFormPassword: publicProcedure
        .meta({ openapi: { method: "POST", path: getPath("/verifyFormPassword"), tags: TAGS } })
        .input(verifyFormPasswordInputModel)
        .output(verifyFormPasswordOutputModel)
        .mutation(async ({ input }) => {
            const result = await userService.verifyFormPassword(input);
            return result;
        }),

    submitFormResponse: publicProcedure
        .meta({ openapi: { method: "POST", path: getPath("/submit-form-response"), tags: TAGS } })
        .input(submitFormResponseInputModel)
        .output(submitFormResponseOutputModel)
        .mutation(async ({ input }) => {
            const result = await userService.submitFormResponse(input);
            return { id: result.id };
        }),

    getFormResponses: protectedProcedure
        .meta({ openapi: { method: "GET", path: getPath("/get-form-responses"), tags: TAGS } })
        .input(getFormResponsesInputModel)
        .output(getFormResponsesOutputModel)
        .query(async ({ input, ctx }) => {
            const result = await userService.getFormResponses({
                formId: input.formId,
                userId: ctx.user.id as string
            });
            return {
                published: result.published,
                responses: result.responses,
            };
        }),

    getTrashedForms: protectedProcedure
        .meta({ openapi: { method: "GET", path: getPath("/get-trashed-forms"), tags: TAGS } })
        .output(getTrashedFormsOutputModel)
        .query(async ({ ctx }) => {
            const forms = await userService.getTrashedForms({ userId: ctx.user.id as string });
            return forms;
        }),

    softDeleteForm: protectedProcedure
        .meta({ openapi: { method: "POST", path: getPath("/soft-delete-form"), tags: TAGS } })
        .input(deleteFormInputModel)
        .output(deleteFormOutputModel)
        .mutation(async ({ input, ctx }) => {
            const result = await userService.softDeleteForm({
                formId: input.formId,
                userId: ctx.user.id as string
            });
            return { id: result.id };
        }),

    restoreForm: protectedProcedure
        .meta({ openapi: { method: "POST", path: getPath("/restore-form"), tags: TAGS } })
        .input(deleteFormInputModel)
        .output(deleteFormOutputModel)
        .mutation(async ({ input, ctx }) => {
            const result = await userService.restoreForm({
                formId: input.formId,
                userId: ctx.user.id as string
            });
            return { id: result.id };
        }),

    hardDeleteForm: protectedProcedure
        .meta({ openapi: { method: "POST", path: getPath("/hard-delete-form"), tags: TAGS } })
        .input(deleteFormInputModel)
        .output(deleteFormOutputModel)
        .mutation(async ({ input, ctx }) => {
            const result = await userService.hardDeleteForm({
                formId: input.formId,
                userId: ctx.user.id as string
            });
            return { id: result.id };
        }),

});
