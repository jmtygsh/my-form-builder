import { trpc } from "~/trpc/client";

export const useCreateFormDisplay = () => {
    const utils = trpc.useUtils();

    const {
        mutateAsync: createNewFormDisplayAsync,
        mutate: createNewFormDisplay,
        error,
        isError,
        isIdle,
        isSuccess,
        status,
        isPending
    } = trpc.form.createNewForm.useMutation({
        onSuccess: () => {
            utils.form.getFormDisplayList.invalidate();
        }
    });

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

export const useSaveDraftForm = () => {
    const utils = trpc.useUtils();

    const {
        mutateAsync: saveDraftFormAsync,
        mutate: saveDraftForm,
        error,
        isError,
        isIdle,
        isSuccess,
        status,
        isPending
    } = trpc.form.saveDraftForm.useMutation({
        onSuccess: () => {
            utils.form.getFormDisplayList.invalidate();
        }
    });

    return {
        saveDraftFormAsync,
        saveDraftForm,
        error,
        isError,
        isIdle,
        isSuccess,
        status,
        isPending
    };
};

export const useLoadDraftedForm = (formId: string) => {
    const { data, error, isFetched, isFetching, isLoading, status } = trpc.form.loadDraftedForm.useQuery({ formId }, {
        enabled: !!formId,
        refetchOnWindowFocus: false, // Prevents overwriting local state with server state if user switches tabs
    });

    return {
        draftedForm: data?.draft,
        error,
        isFetched,
        isFetching,
        isLoading,
        status
    };
};

export const usePublishForm = () => {
    const utils = trpc.useUtils();

    const {
        mutateAsync: publishFormAsync,
        mutate: publishForm,
        error,
        isError,
        isIdle,
        isSuccess,
        status,
        isPending
    } = trpc.form.publishForm.useMutation({
        onSuccess: () => {
            utils.form.getFormDisplayList.invalidate();
        }
    });

    return {
        publishFormAsync,
        publishForm,
        error,
        isError,
        isIdle,
        isSuccess,
        status,
        isPending
    };
};

export const useGetFormBySlug = (slug: string) => {
    const { data, error, isFetched, isFetching, isLoading, status } = trpc.form.getFormBySlug.useQuery(
        { slug },
        { enabled: !!slug, retry: false }
    );

    return {
        form: data,
        error,
        isFetched,
        isFetching,
        isLoading,
        status
    };
};

export const useVerifyFormPassword = () => {
    const {
        mutateAsync: verifyFormPasswordAsync,
        mutate: verifyFormPassword,
        error,
        isError,
        isIdle,
        isSuccess,
        status,
        isPending
    } = trpc.form.verifyFormPassword.useMutation();

    return {
        verifyFormPasswordAsync,
        verifyFormPassword,
        error,
        isError,
        isIdle,
        isSuccess,
        status,
        isPending
    };
};

export const useSubmitFormResponse = () => {
    const {
        mutateAsync: submitFormResponseAsync,
        mutate: submitFormResponse,
        error,
        isError,
        isIdle,
        isSuccess,
        status,
        isPending
    } = trpc.form.submitFormResponse.useMutation();

    return {
        submitFormResponseAsync,
        submitFormResponse,
        error,
        isError,
        isIdle,
        isSuccess,
        status,
        isPending
    };
};



