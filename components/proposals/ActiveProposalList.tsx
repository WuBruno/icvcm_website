import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import useSWR from "swr";
import { ProposalState } from "~/@types";
import { VoteButton } from "~/components/vote";
import { useICVCMGovernor, useICVCMRoles } from "~/hooks/contracts";
import { getProposals } from "~/services/proposals";

const ActiveProposalList = () => {
  const { account } = useWeb3React();
  const ICVCMGovernor = useICVCMGovernor();
  const ICVCMRoles = useICVCMRoles();
  const shouldFetch = !!account;

  const { data: proposals } = useSWR(
    shouldFetch ? "getProposals" : null,
    async () => getProposals(ICVCMGovernor, ICVCMRoles)
  );

  const activeProposals =
    proposals &&
    proposals.filter((proposal) =>
      [ProposalState.Active, ProposalState.Pending].includes(proposal.state)
    );

  return (
    <div>
      <Typography variant="h5" sx={{ marginTop: 4 }}>
        Active Proposals
      </Typography>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Description</TableCell>
              <TableCell align="right">Proposer</TableCell>
              <TableCell align="right">Status</TableCell>
              <TableCell align="right">Vote</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {activeProposals &&
              activeProposals.map((proposal) => (
                <TableRow
                  key={proposal.proposalId}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                  }}
                >
                  <TableCell component="th" scope="row">
                    {proposal.description}
                  </TableCell>
                  <TableCell align="right">{proposal.proposer.name}</TableCell>
                  <TableCell align="right">
                    {ProposalState[proposal.state]}
                  </TableCell>
                  <TableCell align="right">
                    <VoteButton proposal={proposal} />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ActiveProposalList;
