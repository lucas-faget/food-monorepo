export type RequestOptions<T> = {
    notify?: boolean;
    successMessage?: string;
    errorMessage?: string;
    onSuccess?: (data: T) => void;
    onError?: (error: any) => void;
};
