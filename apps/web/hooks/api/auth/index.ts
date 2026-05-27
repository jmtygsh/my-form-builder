
import { trpc } from "~/trpc/client";

export const useSignUp = () => {

    // refresh useUser again if sign up is complete (may be your cache is not updated so, refresh it) tell to useUser hook
    const utils = trpc.useUtils();

    const {
        mutateAsync: createUserWithEmailAndPasswordAsync,
        mutate: createUserWithEmailAndPassword,
        error,
        failureCount,
        isError,
        isIdle,
        isSuccess,
        status

    }
        = trpc.auth.createUserWithEmailAndPassword.useMutation(

            {
                // hook for useUser to refresh user info
                onSuccess: async () => {
                    await utils.auth.getLoggedInUserInfo.invalidate();
                }
            }
        );


    return {
        createUserWithEmailAndPasswordAsync,
        createUserWithEmailAndPassword,
        error,
        failureCount,
        isError,
        isIdle,
        isSuccess,
        status
    }
}


export const useVerifyEmail = () => {

    const utils = trpc.useUtils();

    const {
        mutateAsync: verifyUserEmailWithTokenAsync,
        mutate: verifyUserEmailWithToken,
        error,
        failureCount,
        isError,
        isIdle,
        isSuccess,
        status
    } = trpc.auth.verifyUserEmailWithToken.useMutation({
        onSuccess: async () => {
            await utils.auth.getLoggedInUserInfo.invalidate();
        }
    });

    return {
        verifyUserEmailWithTokenAsync,
        verifyUserEmailWithToken,
        error,
        failureCount,
        isError,
        isIdle,
        isSuccess,
        status
    }
}




export const useSignIn = () => {

    // refresh useUser again if sign up is complete (may be your cache is not updated so, refresh it) tell to useUser hook
    const utils = trpc.useUtils();


    const {
        mutateAsync: signInUserWithEmailAndPasswordAsync,
        mutate: signInUserWithEmailAndPassword,
        error,
        failureCount,
        isError,
        isIdle,
        isSuccess,
        status

    }
        = trpc.auth.signInUserWithEmailAndPassword.useMutation(

            {
                // hook for useUser to refresh user info
                onSuccess: async () => {
                    await utils.auth.getLoggedInUserInfo.invalidate();
                }
            }
        );


    return {
        signInUserWithEmailAndPasswordAsync,
        signInUserWithEmailAndPassword,
        error,
        failureCount,
        isError,
        isIdle,
        isSuccess,
        status
    }
}


// to use

// const { signInUserWithEmailAndPasswordAsync } = useSignIn()

// // then on submit funtion with asynce funtion

// const {id} = await signInUserWithEmailAndPasswordAsync({
//     email,
//     password
// })




export const useUser = () => {
    const { data: user, error, isFetched, isFetching, isLoading, status } = trpc.auth.getLoggedInUserInfo.useQuery()
    return {
        user,
        error,
        isFetched,
        isFetching,
        isLoading,
        status
    }
}

export const useLogout = () => {
    const utils = trpc.useUtils();

    const {
        mutateAsync: logoutAsync,
        mutate: logout,
        error,
        isError,
        isIdle,
        isSuccess,
        status
    } = trpc.auth.logout.useMutation({
        onSuccess: async () => {
            await utils.auth.getLoggedInUserInfo.invalidate();
        }
    });

    return {
        logoutAsync,
        logout,
        error,
        isError,
        isIdle,
        isSuccess,
        status
    }
}