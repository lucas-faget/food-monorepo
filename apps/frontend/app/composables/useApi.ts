export const useApi = () => {
    return $fetch.create({
        baseURL: "http://localhost:3333",
    });
};
