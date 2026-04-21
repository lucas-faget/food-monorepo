import type { RequestOptions } from "~/types/RequestOptions";

export const useApiRequest = () => {
    const toast = useToast();

    const handle = async <T>(request: () => Promise<T>, options?: RequestOptions<T>): Promise<T> => {
        try {
            const data = await request();

            if (options?.notify !== false) {
                toast.add({
                    title: options?.successMessage ?? "Operation completed successfully",
                    color: "success",
                    icon: "i-lucide-circle-check",
                });
            }

            options?.onSuccess?.(data);

            return data;
        } catch (error: any) {
            if (options?.notify !== false) {
                toast.add({
                    title: options?.errorMessage ?? "Something went wrong",
                    color: "error",
                    icon: "i-lucide-circle-x",
                });
            }

            options?.onError?.(error);

            throw error;
        }
    };

    return { handle };
};
