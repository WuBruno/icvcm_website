import { useWeb3React } from "@web3-react/core";
import Head from "next/head";
import Link from "next/link";
import Account from "../components/Account";
import ETHBalance from "../components/ETHBalance";
import TokenBalance from "../components/TokenBalance";
import useEagerConnect from "../hooks/useEagerConnect";
import Typography from '@mui/material/Typography';
import useICVCMGovernor from "../hooks/useICVCMGovernor";
import { useCallback, useEffect, useState } from "react";
import useICVCMToken from "../hooks/useICVCMToken";
import { Button, Card, CardContent, Modal, Stack, TextField } from "@mui/material";
import { Proposal } from "~/@types";
import ContractAddress from '~/contract.json';
import ProposeButton from "~/components/ProposeButton";
import { getProposals } from "~/services/ICVCMGovernor";

function Home() {
  const { account, library } = useWeb3React();
  const [proposals, setProposals] = useState<Proposal[]>([]);


  const triedToEagerConnect = useEagerConnect();

  const ICVCMGovernor = useICVCMGovernor();
  const ICVCMToken = useICVCMToken();

  const loadEvents = useCallback(async () => {
    if (!ICVCMGovernor || !ICVCMToken || !account) {
      return;
    }

    const events = await getProposals(ICVCMGovernor);
    setProposals(events);
  }, [ICVCMGovernor, ICVCMToken, account, getProposals]);


  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const isConnected = typeof account === "string" && !!library;

  return (
    <div>
      <Head>
        <title>next-web3-boilerplate</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header>
        <nav>
          <Link href="/">
            <a>ICVCM Governance</a>
          </Link>

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
