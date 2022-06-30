import { useWeb3React } from "@web3-react/core";
import Head from "next/head";
import Link from "next/link";
import Account from "../components/Account";
import ETHBalance from "../components/ETHBalance";
import TokenBalance from "../components/TokenBalance";
import useEagerConnect from "../hooks/useEagerConnect";
import Typography from '@mui/material/Typography'
import useICVCMGovernor, { propose, getProposalState, proposalEvents, Proposal } from "../hooks/useICVCMGovernor";
import { useCallback, useEffect, useState } from "react";
import useICVCMToken from "../hooks/useICVCMToken";
import { Backdrop, Box, Button, Card, CardContent, CircularProgress, Container, Divider, Modal, Stack, TextField } from "@mui/material";

const ICVCM_NFT_ADDRESS = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};
function Home() {
  const { account, library, chainId } = useWeb3React();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState('Controlled');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const triedToEagerConnect = useEagerConnect();

  const ICVCMGovernor = useICVCMGovernor();
  const ICVCMToken = useICVCMToken()

  const loadEvents = useCallback(async () => {
    if (!ICVCMGovernor || !ICVCMToken || !account) {
      return
    }

    const events = await proposalEvents(ICVCMGovernor)
    setProposals(events)
  }, [ICVCMGovernor, ICVCMToken, account])

  const submitProposal = async () => {
    setOpen(false)
    setLoading(true)
    const proposalId = await propose(ICVCMGovernor, ICVCMToken, account, value)
    console.log(proposalId);
    setLoading(false)
  }

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

              <TokenBalance tokenAddress={ICVCM_NFT_ADDRESS} symbol="ICVCM" />
            </section>
          )}

          <Button variant="contained" onClick={() => setOpen(true)}>Create Proposal</Button>

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

          <Modal open={open} onClose={() => setOpen(false)}>
            <Stack spacing={2} sx={style}>
              <Typography variant="h5">
                Create Proposal
              </Typography>
              <TextField label="Description" multiline onChange={handleChange} />
              <Button variant="contained" onClick={submitProposal}>Propose</Button>
            </Stack>
          </Modal>

        </Stack>
      </main>

      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

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
