import useGlobalLoader from "./useGlobalLoader";

const useAsync = <T>(
  callback: () => Promise<T>
): [boolean, () => Promise<T>] => {
  const { isLoading, startLoading, stopLoading } = useGlobalLoader();

  const execute = async () => {
    startLoading();
    const result = await callback();
    stopLoading();

    return result;
  };

  return [isLoading, execute];
};

export default useAsync;
