import { Button, Stack } from "@mui/material";
import styled from "@mui/styled-engine";
import { useWeb3React } from "@web3-react/core";
import { useState } from "react";
import useSWR from "swr";
import { Proposal, VoteSupport } from "~/@types";
import { Roles } from "~/@types/Roles";
import { useAsync, useUser } from "~/hooks/common";
import { useICVCMGovernor } from "~/hooks/contracts";
import { cancelProposal } from "~/services/proposals";
import { castVote, getVote } from "~/services/vote";
import InputModal from "../common/InputModal";

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
  const [showCancelInput, setShowCancelInput] = useState(false);
  const [showVoteAgainstInput, setShowVoteAgainstInput] = useState(false);
  const isDirector = user && user.role == Roles.Director;
  const isRegulator = user && user.role === Roles.Regulator;

  const { data: vote } = useSWR(
    shouldFetch ? ["getVote", proposal.proposalId, account] : null,
    async () => getVote(ICVCMGovernor, proposal.proposalId, account)
  );
  const [, executeVote] = useAsync(async (support: VoteSupport, reason = "") =>
    castVote(ICVCMGovernor, proposal.proposalId, support, reason)
  );
  const [, executeCancel] = useAsync(async (reason = "") =>
    cancelProposal(ICVCMGovernor, proposal, reason)
  );

  if (isRegulator) {
    return (
      <div>
        <FixedButton
          variant="outlined"
          color="error"
          onClick={() => setShowCancelInput(true)}
        >
          Cancel
        </FixedButton>
        <InputModal
          open={showCancelInput}
          setOpen={setShowCancelInput}
          title="Cancel Proposal"
          label="Comment"
          onSubmit={(reason) => executeCancel(reason)}
        />
      </div>
    );
  }

  if (vote)
    return (
      <FixedButton variant="outlined" disabled>
        {VoteSupport[vote.support]}
      </FixedButton>
    );

  return (
    <Stack direction="row" justifyContent="flex-end" spacing={1}>
      <FixedButton
        variant="contained"
        color="success"
        disabled={!isDirector}
        onClick={() => executeVote(VoteSupport.For)}
      >
        For
      </FixedButton>
      <FixedButton
        variant="outlined"
        disabled={!isDirector}
        onClick={() => executeVote(VoteSupport.Abstain)}
      >
        Abstain
      </FixedButton>
      <FixedButton
        variant="outlined"
        color="error"
        disabled={!isDirector}
        onClick={() => setShowVoteAgainstInput(true)}
      >
        Against
      </FixedButton>
      <InputModal
        open={showVoteAgainstInput}
        setOpen={setShowVoteAgainstInput}
        title="Vote Against"
        label="Comment"
        onSubmit={(reason) => executeVote(VoteSupport.Against, reason)}
      />
    </Stack>
  );
};

export default VoteButton;
