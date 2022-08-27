import { ThemeProvider } from "@mui/material";
import { Web3ReactProvider } from "@web3-react/core";
import type { AppProps } from "next/app";
import { RecoilRoot } from "recoil";
import { GlobalLoader } from "~/components/common";
import getLibrary from "~/getLibrary";
import "~/styles/globals.css";
import { theme } from "~/styles/theme";

function NextWeb3App({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <Web3ReactProvider getLibrary={getLibrary}>
        <ThemeProvider theme={theme}>
          <Component {...pageProps} />
          <GlobalLoader />
        </ThemeProvider>
      </Web3ReactProvider>
    </RecoilRoot>
  );
}

export default NextWeb3App;
