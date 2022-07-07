import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import React from 'react';
import { ProposalState } from '~/@types';
import { useICVCMGovernor } from '~/hooks';
import { getProposals } from '~/services/governor';
import { VoteButton } from '~/components/vote';
import useSWR from 'swr';

type Props = {}

const ProposalList = (props: Props) => {
  const { account } = useWeb3React();
  const ICVCMGovernor = useICVCMGovernor();
  const shouldFetch = !!account;

  const { data: proposals } = useSWR(shouldFetch ? 'getProposals' : null, async () => getProposals(ICVCMGovernor));

  return (
    <div>
      <Typography variant="h6" sx={{ marginTop: 4 }}>
        Proposals
      </Typography>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Description</TableCell>
              <TableCell align="right">Status</TableCell>
              <TableCell align="right">Vote</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {proposals && proposals.map((proposal) => (
              <TableRow
                key={proposal.proposalId}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {proposal.description}
                </TableCell>
                <TableCell align="right">{ProposalState[proposal.state]}</TableCell>
                <TableCell align="right">
                  <VoteButton proposalId={proposal.proposalId} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div >
  );
};

export default ProposalList;