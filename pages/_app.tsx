import { Web3ReactProvider } from "@web3-react/core";
import type { AppProps } from "next/app";
import { RecoilRoot } from "recoil";
import { GlobalLoader } from "~/components";
import getLibrary from "../getLibrary";
import "../styles/globals.css";

function NextWeb3App({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <Web3ReactProvider getLibrary={getLibrary}>
        <Component {...pageProps} />
        <GlobalLoader />
      </Web3ReactProvider>
    </RecoilRoot>
  );
}

export default NextWeb3App;
