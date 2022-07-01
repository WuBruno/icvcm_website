import { Card, CardContent, Stack, Typography } from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import React, { useCallback, useEffect, useState } from 'react';
import { Proposal } from '~/@types';
import { useICVCMGovernor } from '~/hooks';
import { getProposals } from '~/services/ICVCMGovernor';

type Props = {}

const ProposalList = (props: Props) => {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const { account } = useWeb3React();
  const ICVCMGovernor = useICVCMGovernor();

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

  return (
    <div>
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
    </div>
  );
};

export default ProposalList;