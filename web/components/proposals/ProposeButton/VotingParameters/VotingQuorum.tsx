import { Button, InputAdornment, Stack, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import useSWR from "swr";
import { useAsync } from "~/hooks/common";
import { useICVCMGovernor } from "~/hooks/contracts";
import { getQuorum, proposeVotingQuorum } from "~/services/proposals";

type Props = { setOpen: (open: boolean) => void };

function VotingQuorum({ setOpen }: Props) {
  const [description, setDescription] = useState("");
  const [quorum, setQuorum] = useState("");
  const ICVCMGovernor = useICVCMGovernor();

  const [_, submit] = useAsync(submitProposal);
  const { data, error } = useSWR(ICVCMGovernor ? "getQuorum" : null, async () =>
    getQuorum(ICVCMGovernor)
  );

  useEffect(() => {
    if (data) {
      setQuorum(data.toString());
    }
  }, [data]);

  async function submitProposal() {
    setOpen(false);
    await proposeVotingQuorum(ICVCMGovernor, description, Number(quorum));
  }

  const handleChangeDescription = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDescription(event.target.value);
  };

  const handleChangeQuorum = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuorum(event.target.value);
  };

  return (
    <Stack spacing={2}>
      <TextField
        label="Description"
        multiline
        onChange={handleChangeDescription}
      />
      <TextField
        label="Voting Quorum"
        type="number"
        InputLabelProps={{
          shrink: true,
        }}
        value={quorum}
        onChange={handleChangeQuorum}
        InputProps={{
          endAdornment: <InputAdornment position="end">%</InputAdornment>,
        }}
      />

      <Button
        variant="contained"
        disabled={
          !quorum ||
          data.toString() === quorum ||
          Number(quorum) < 0 ||
          Number(quorum) > 100
        }
        onClick={submit}
      >
        Propose
      </Button>
    </Stack>
  );
}

export default VotingQuorum;
