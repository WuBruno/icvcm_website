import { Button, Stack, Typography } from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import { BigNumberish } from "ethers";
import React from "react";
import useSWR from "swr";
import { VoteSupport } from "~/@types";
import { useAsync, useICVCMGovernor } from "~/hooks";
import { castVote, getVote } from "~/services/vote";
import styled from "@mui/styled-engine";

type Props = {
  proposalId: BigNumberish;
};

const FixedButton = styled(Button)`
  width: 85px;
`;

const VoteButton = ({ proposalId }: Props) => {
  const ICVCMGovernor = useICVCMGovernor();
  const { account } = useWeb3React();
  const shouldFetch = !!proposalId && !!account;

  const { data: vote } = useSWR(
    shouldFetch ? ["getVote", proposalId] : null,
    () => getVote(ICVCMGovernor, proposalId, account)
  );
  const [_, executeVote] = useAsync(async (support: VoteSupport) =>
    castVote(ICVCMGovernor, proposalId, support)
  );

  if (vote === null) {
    return null;
  }

  if (vote) {
    return (
      <FixedButton variant="outlined" disabled>
        {vote.support === VoteSupport.For ? "For" : "Against"}
      </FixedButton>
    );
  }

  return (
    <Stack direction="row" justifyContent="flex-end" spacing={1}>
      <FixedButton
        variant="contained"
        color="success"
        onClick={() => executeVote(VoteSupport.For)}
      >
        For
      </FixedButton>
      <FixedButton
        variant="outlined"
        color="error"
        onClick={() => executeVote(VoteSupport.Abstain)}
      >
        Against
      </FixedButton>
    </Stack>
  );
};

export default VoteButton;
