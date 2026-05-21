import { trpc } from "~/trpc/client";

export const useCreateFormDisplay = () => {
    const {
        mutateAsync: createNewFormDisplayAsync,
        mutate: createNewFormDisplay,
        error,
        isError,
        isIdle,
        isSuccess,
        status,
        isPending
    } = trpc.form.createNewForm.useMutation();

    return {
        createNewFormDisplayAsync,
        createNewFormDisplay,
        error,
        isError,
        isIdle,
        isSuccess,
        status,
        isPending
    };
};

export const useGetFormDisplayList = () => {
    const { data: formDisplayList, error, isFetched, isFetching, isLoading, status } = trpc.form.getFormDisplayList.useQuery(undefined);
    return {
        formDisplayList,
        error,
        isFetched,
        isFetching,
        isLoading,
        status
    };
};


