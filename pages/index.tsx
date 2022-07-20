import React from "react";
import { Container, Typography } from "@mui/material";
import { useWeb3React } from "@web3-react/core";

import ContractAddress from "~/contract.json";
import { ETHBalance, TokenBalance } from "~/components/accounts";
import {
  ActiveProposalList,
  CompletedProposalList,
  ProposeButton,
} from "~/components/proposals";
import { Navbar } from "~/components/common";
import AccountInfo from "~/components/accounts/AccountInfo";
import { ConstitutionInfo } from "~/components/constitution";

function Home() {
  const { account, library } = useWeb3React();

  const isConnected = typeof account === "string" && !!library;

  return (
    <div>
      <Navbar />

      <Container maxWidth="md" sx={{ marginTop: 5 }}>
        <Typography color="textPrimary" variant="h2" textAlign="center">
          ICVCM Governance
        </Typography>

        {isConnected && (
          <section>
            <ETHBalance />

            <TokenBalance
              tokenAddress={ContractAddress.ICVCMToken}
              symbol="ICVCM"
            />
          </section>
        )}

        <AccountInfo />

        <ProposeButton />

        <ConstitutionInfo />

        <ActiveProposalList />

        <CompletedProposalList />
      </Container>
    </div>
  );
}

export default Home;
