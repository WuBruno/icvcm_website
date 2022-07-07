import useGlobalLoader from "./useGlobalLoader";

const useAsync = <T, U extends any[]>(
  callback: (...args: U) => Promise<T>
): [boolean, (...args: U) => Promise<T>] => {
  const { isLoading, startLoading, stopLoading } = useGlobalLoader();

  const execute = async (...args: U) => {
    startLoading();
    const result = await callback(...args);
    stopLoading();

    return result;
  };

  return [isLoading, execute];
};

export default useAsync;
