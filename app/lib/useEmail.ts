import useSWR from "swr";

const fetcher = (url: RequestInfo, init?: RequestInit) =>
  fetch(url, init).then((res) => res.json());

export const useEmail = (uid: string | undefined) => {
  const { data, isLoading, error, mutate } = useSWR(
    uid ? `/api/inbox/${uid}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  return {
    data,
    isLoading,
    error,
    mutate,
  };
};
