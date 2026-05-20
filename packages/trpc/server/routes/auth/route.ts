import { userService } from "../../services";
import { createUserWithEmailAndPasswordInputModel, createUserWithEmailAndPasswordOutputModel, forgetPasswordInputModel, forgetPasswordOutputModel, getLoggerInUserInfoInputModel, getLoggerInUserInfoOutput, signInUserWithEmailAndPasswordInputModel, signInUserWithEmailAndPasswordOutputModel, verifyUserEmailWithTokenInputModel, verifyUserEmailWithTokenOutputModel, resetPasswordInputModel, resetPasswordOutputModel } from "./model";

import { publicProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import { getAuthenticationCookie, setAuthenticationCookie } from "../../utils/cookie";

const TAGS = ["Authentication"];
const getPath = generatePath("/authentication");

export const authRouter = router({

  createUserWithEmailAndPassword: publicProcedure
    .meta({ openapi: { method: "POST", path: getPath("/createUserWithEmailAndPassword"), tags: TAGS } })
    .input(createUserWithEmailAndPasswordInputModel)
    .output(createUserWithEmailAndPasswordOutputModel)
    .mutation(async ({ input, ctx }) => {
      const { fullName, email, password } = input;
      const { id, token } = await userService.createUserWithEmailAndPassword({ fullName, email, password });

      // set cookie with auth token
      setAuthenticationCookie(ctx, token)

      return {
        id
      };
    }),


  signInUserWithEmailAndPassword: publicProcedure
    .meta({ openapi: { method: "POST", path: getPath("/signInUserWithEmailAndPassword"), tags: TAGS } })
    .input(signInUserWithEmailAndPasswordInputModel)
    .output(signInUserWithEmailAndPasswordOutputModel)
    .mutation(async ({ input, ctx }) => {
      const { email, password } = input;
      const { id, token } = await userService.signInUserWithEmailAndPassword({ email, password });

      // set cookie with auth token
      setAuthenticationCookie(ctx, token)

      return {
        id
      };
    }),


  getLoggedInUserInfo: publicProcedure
    .meta({ openapi: { method: "POST", path: getPath("/getLoggedInUserInfo"), tags: TAGS } })
    .input(getLoggerInUserInfoInputModel)
    .output(getLoggerInUserInfoOutput)
    .query(async ({ ctx }) => {

      const userToken = getAuthenticationCookie(ctx);
      if (!userToken) throw new Error(`user is not logged in`)

      const { id, email, fullName, profileImageUrl } = await userService.verifyAndDecoderUserToken(userToken)

      if (!id || !email || !fullName) {
        throw new Error("User data is incomplete");
      }

      return {
        id,
        email,
        fullName,
        profileImageUrl
      }
    }),


  verifyUserEmailWithToken: publicProcedure
    .meta({ openapi: { method: "POST", path: getPath("/verifyUserEmailWithToken"), tags: TAGS } })
    .input(verifyUserEmailWithTokenInputModel)
    .output(verifyUserEmailWithTokenOutputModel)
    .mutation(async ({ input }) => {
      const { id } = await userService.verifyUserEmailWithToken({ token: input.token });
      return {
        id
      };
    }),


  forgetPassword: publicProcedure
    .meta({ openapi: { method: "POST", path: getPath("/forgetPassword"), tags: TAGS } })
    .input(forgetPasswordInputModel)
    .output(forgetPasswordOutputModel)
    .mutation(async ({ input }) => {
      const { message } = await userService.forgetPassword({ email: input.email });
      return {
        message
      };
    }),

  resetPassword: publicProcedure
    .meta({ openapi: { method: "POST", path: getPath("/resetPassword"), tags: TAGS } })
    .input(resetPasswordInputModel)
    .output(resetPasswordOutputModel)
    .mutation(async ({ input }) => {
      const { id } = await userService.setNewPasswordForEmailUser({
        token: input.token,
        password: input.password
      });
      return {
        id
      };
    }),

});
