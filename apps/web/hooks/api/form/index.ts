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

export const useGetFormResponses = (formId: string) => {
    const { data, error, isFetched, isFetching, isLoading, status } = trpc.form.getFormResponses.useQuery(
        { formId },
        { enabled: !!formId }
    );

    return {
        published: data?.published,
        responses: data?.responses,
        error,
        isFetched,
        isFetching,
        isLoading,
        status
    };
};

export const useGetTrashedForms = () => {
    const { data: trashedForms, error, isFetched, isFetching, isLoading, status } = trpc.form.getTrashedForms.useQuery(undefined);
    return {
        trashedForms,
        error,
        isFetched,
        isFetching,
        isLoading,
        status
    };
};

export const useSoftDeleteForm = () => {
    const utils = trpc.useUtils();

    const {
        mutateAsync: softDeleteFormAsync,
        mutate: softDeleteForm,
        error,
        isPending
    } = trpc.form.softDeleteForm.useMutation({
        onSuccess: () => {
            utils.form.getFormDisplayList.invalidate();
            utils.form.getTrashedForms.invalidate();
        }
    });

    return { softDeleteFormAsync, softDeleteForm, error, isPending };
};

export const useRestoreForm = () => {
    const utils = trpc.useUtils();

    const {
        mutateAsync: restoreFormAsync,
        mutate: restoreForm,
        error,
        isPending
    } = trpc.form.restoreForm.useMutation({
        onSuccess: () => {
            utils.form.getFormDisplayList.invalidate();
            utils.form.getTrashedForms.invalidate();
        }
    });

    return { restoreFormAsync, restoreForm, error, isPending };
};

export const useHardDeleteForm = () => {
    const utils = trpc.useUtils();

    const {
        mutateAsync: hardDeleteFormAsync,
        mutate: hardDeleteForm,
        error,
        isPending
    } = trpc.form.hardDeleteForm.useMutation({
        onSuccess: () => {
            utils.form.getTrashedForms.invalidate();
        }
    });

    return { hardDeleteFormAsync, hardDeleteForm, error, isPending };
};



