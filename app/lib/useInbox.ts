import useSWR from "swr";

const fetcher = (url: RequestInfo, init?: RequestInit) =>
  fetch(url, init).then((res) => res.json());

export const useInbox = (key: string) => {
  const { data, isLoading, error, mutate } = useSWR<unknown[]>(key, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  return {
    data,
    isLoading,
    error,
    mutate,
  };
};
