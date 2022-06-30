import React, { useCallback, useEffect, useState } from "react";
import { Card, CardContent, Stack, Typography } from "@mui/material";
import { useWeb3React } from "@web3-react/core";

import useEagerConnect from "~/hooks/useEagerConnect";
import useICVCMGovernor from "../hooks/useICVCMGovernor";
import useICVCMToken from "../hooks/useICVCMToken";
import { Proposal } from "~/@types";
import ContractAddress from '~/contract.json';
import { Account, ETHBalance, TokenBalance } from "~/components/accounts";
import { ProposeButton } from "~/components/proposals";
import { getProposals } from "~/services/ICVCMGovernor";
import { Navbar } from "~/components/common";

function Home() {
  const { account, library } = useWeb3React();
  const [proposals, setProposals] = useState<Proposal[]>([]);


  const triedToEagerConnect = useEagerConnect();

  const ICVCMGovernor = useICVCMGovernor();
  const ICVCMToken = useICVCMToken();

  const loadEvents = useCallback(async () => {
    if (!ICVCMGovernor || !account) {
      return;
    }

    const events = await getProposals(ICVCMGovernor);
    setProposals(events);
  }, [ICVCMGovernor, account]);


  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const isConnected = typeof account === "string" && !!library;

  return (
    <div>
      <Navbar />

      <header>
        <nav>

          <Account triedToEagerConnect={triedToEagerConnect} />
        </nav>
      </header>

      <main>
        <Stack spacing={2} alignItems='center'>

          <Typography variant="h2">
            ICVCM Governance
          </Typography >

          {isConnected && (
            <section>
              <ETHBalance />

              <TokenBalance tokenAddress={ContractAddress.ICVCMToken} symbol="ICVCM" />
            </section>
          )}

          <ProposeButton />

          <Typography variant="h6">
            Proposals
          </Typography>

          <Stack spacing={2} alignItems='center'>
            {proposals && proposals.map((proposal) => <Card key={proposal.proposalId}>
              <CardContent>
                <Typography>
                  <strong>{proposal.description}</strong>
                </Typography>
                <Typography>
                  {proposal.proposalId}
                </Typography>
              </CardContent>
            </Card>)}
          </Stack>


        </Stack>
      </main>

      <style jsx>{`
        nav {
          display: flex;
          justify-content: space-between;
        }

        main {
          text-align: center;
        }
      `}</style>
    </div>
  );
}

export default Home;
