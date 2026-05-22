import { initTRPC, TRPCError } from "@trpc/server";
import { OpenApiMeta } from "trpc-to-openapi";

import { createContext } from "./context";
import { getAuthenticationCookie } from "./utils/cookie";
import { userService } from "./services";

export const tRPCContext = initTRPC
  .meta<OpenApiMeta>()
  .context<typeof createContext>()
  .create({
    errorFormatter({ shape, error }) {

      if (error.code !== 'INTERNAL_SERVER_ERROR') {
        return shape;
      }

      const isStandardError = error.cause instanceof Error && error.cause.name === 'Error';

      const safeMessage = isStandardError
        ? error.message
        : "An unexpected internal server error occurred.";

      if (!isStandardError) {
        console.error("🔥 UNHANDLED SYSTEM ERROR:", error);
      }

      return {
        ...shape,
        message: safeMessage,
        data: {
          ...shape.data,
          // Remove the stack trace from the frontend entirely
          stack: undefined,
        },
      };
    },
  });

export const router = tRPCContext.router;

export const publicProcedure = tRPCContext.procedure;

const isAuthed = tRPCContext.middleware(async ({ ctx, next }) => {
  const userToken = getAuthenticationCookie(ctx);
  if (!userToken) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "User is not logged in",
    });
  }

  try {
    const user = await userService.verifyAndDecoderUserToken(userToken);
    if (!user || !user.id || !user.email || !user.fullName) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User data is incomplete",
      });
    }

    return next({
      ctx: {
        ...ctx,
        user,
      },
    });
  } catch (error) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Invalid or expired token",
    });
  }
});

export const protectedProcedure = tRPCContext.procedure.use(isAuthed);
