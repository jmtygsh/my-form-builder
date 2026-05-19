import type { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import { clearCookieFactory, createCookieFactory, getCookieFactory } from './utils/cookie';

export interface TRPCConext {
    createCookie: ReturnType<typeof createCookieFactory>
    getCookie: ReturnType<typeof getCookieFactory>
    clearCookie: ReturnType<typeof clearCookieFactory>
}

export async function createContext({ req, res }: CreateExpressContextOptions): Promise<TRPCConext> {

    const ctx: TRPCConext = {
        createCookie: createCookieFactory(res),
        getCookie: getCookieFactory(req),
        clearCookie: clearCookieFactory(res)
    }

    return ctx;

}


export type Context = Awaited<ReturnType<typeof createContext>>;


// like a middleware