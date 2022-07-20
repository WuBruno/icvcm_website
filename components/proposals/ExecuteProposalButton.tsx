import { Button } from '@mui/material';
import React from 'react';
import { Proposal, ProposalState } from '~/@types';
import { useAsync, useICVCMGovernor } from '~/hooks';
import { executeProposal } from '~/services/proposals';

type Props = {
  proposal: Proposal
}

function ExecuteProposalButton({ proposal }: Props) {
  const ICVCMGovernor = useICVCMGovernor();

  const [_, execute] = useAsync(async () => executeProposal(ICVCMGovernor, proposal));

  switch (proposal.state) {
    case ProposalState.Succeeded:
      return <Button variant="contained" color="success" onClick={() => execute()}>Execute</Button>;
    case ProposalState.Defeated:
      return <Button variant="contained" disabled >Rejected</Button>;
    case ProposalState.Executed:
      return <Button variant="contained" disabled>Executed</Button>;

    default:
      return null;
  }
}

export default ExecuteProposalButton;