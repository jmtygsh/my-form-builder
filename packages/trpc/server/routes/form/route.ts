import { userService } from "../../services";


import { protectedProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import { createNewFormInputModel, createNewFormOutputModel, getFormDisplayListInputModel, getFormDisplayListOutputModel } from "./model";

const TAGS = ["Form"];
const getPath = generatePath("/form");

export const formRouter = router({

    createNewForm: protectedProcedure
        .meta({ openapi: { method: "POST", path: getPath("/createNewForm"), tags: TAGS } })
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


    getFormDisplayList: protectedProcedure
        .meta({ openapi: { method: "GET", path: getPath("/getFormDisplayList"), tags: TAGS } })
        .input(getFormDisplayListInputModel)
        .output(getFormDisplayListOutputModel)
        .query(async ({ ctx }) => {
            const forms = await userService.getFormDisplayList({ userId: ctx.user.id as string });
            return forms;
        }),

});
