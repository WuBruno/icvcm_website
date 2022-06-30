import { useRecoilState } from "recoil";
import { Loader } from "~/recoil/loader";

const useGlobalLoader = () => {
  const [{ loading: isLoading }, setLoader] = useRecoilState(Loader);

  const startLoading = () => setLoader((curr) => ({ ...curr, loading: true }));

  const stopLoading = () => setLoader((curr) => ({ ...curr, loading: false }));

  return { isLoading, startLoading, stopLoading };
};

export default useGlobalLoader;
