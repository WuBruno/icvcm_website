import { Button, Stack } from "@mui/material";
import styled from "@mui/styled-engine";
import { useWeb3React } from "@web3-react/core";
import { BigNumberish } from "ethers";
import useSWR from "swr";
import { VoteSupport } from "~/@types";
import { Roles } from "~/@types/Roles";
import { useAsync, useICVCMGovernor, useUser } from "~/hooks";
import { castVote, getVote } from "~/services/vote";

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
  const { user } = useUser();
  const isDirector = !user || user.role !== Roles.Director;

  const { data: vote } = useSWR(
    shouldFetch ? ["getVote", proposalId] : null,
    async () => getVote(ICVCMGovernor, proposalId, account)
  );
  const [_, executeVote] = useAsync(async (support: VoteSupport) =>
    castVote(ICVCMGovernor, proposalId, support)
  );

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
