import { Container, Typography } from "@mui/material";
import { useWeb3React } from "@web3-react/core";

import { AccountInfo, ETHBalance, TokenBalance } from "~/components/accounts";
import { Navbar } from "~/components/common";
import { ConstitutionInfo } from "~/components/constitution";
import {
  ActiveProposalList,
  CompletedProposalList,
  ProposeButton,
} from "~/components/proposals";
import ContractAddress from "~/contract.json";

function Home() {
  const { account, library } = useWeb3React();

  const isConnected = typeof account === "string" && !!library;

  return (
    <div>
      <Navbar />

      <Container maxWidth="md" sx={{ marginTop: 5, marginBottom: 20 }}>
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
