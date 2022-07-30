import { Button, Stack } from "@mui/material";
import styled from "@mui/styled-engine";
import { useWeb3React } from "@web3-react/core";
import useSWR from "swr";
import { Proposal, VoteSupport } from "~/@types";
import { Roles } from "~/@types/Roles";
import { useAsync, useICVCMGovernor, useUser } from "~/hooks";
import { cancelProposal } from "~/services/proposals";
import { castVote, getVote } from "~/services/vote";

type Props = {
  proposal: Proposal;
};

const FixedButton = styled(Button)`
  width: 85px;
`;

const VoteButton = ({ proposal }: Props) => {
  const ICVCMGovernor = useICVCMGovernor();
  const { account } = useWeb3React();
  const shouldFetch = !!proposal.proposalId && !!account;
  const { user } = useUser();
  const isDirector = user && user.role == Roles.Director;
  const isRegulator = user && user.role === Roles.Regulator;

  const { data: vote } = useSWR(
    shouldFetch ? ["getVote", proposal.proposalId] : null,
    async () => getVote(ICVCMGovernor, proposal.proposalId, account)
  );
  const [, executeVote] = useAsync(async (support: VoteSupport) =>
    castVote(ICVCMGovernor, proposal.proposalId, support)
  );
  const [, executeCancel] = useAsync(async () =>
    cancelProposal(ICVCMGovernor, proposal)
  );

  if (isRegulator) {
    return (
      <FixedButton variant="outlined" color="error" onClick={executeCancel}>
        Cancel
      </FixedButton>
    );
  }

  if (vote)
    return (
      <FixedButton variant="outlined" disabled>
        {vote.support === VoteSupport.For ? "For" : "Against"}
      </FixedButton>
    );

  return (
    <Stack direction="row" justifyContent="flex-end" spacing={1}>
      <FixedButton
        variant="contained"
        color="success"
        disabled={isDirector}
        onClick={() => executeVote(VoteSupport.For)}
      >
        For
      </FixedButton>
      <FixedButton
        variant="outlined"
        color="error"
        disabled={isDirector}
        onClick={() => executeVote(VoteSupport.Abstain)}
      >
        Against
      </FixedButton>
    </Stack>
  );
};

export default VoteButton;
