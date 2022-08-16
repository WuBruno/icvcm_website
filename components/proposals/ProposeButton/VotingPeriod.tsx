import { Button, InputAdornment, Stack, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import useSWR from "swr";
import { useAsync } from "~/hooks/common";
import { useICVCMGovernor } from "~/hooks/contracts";
import { getVotingPeriod, proposeVotingPeriod } from "~/services/proposals";
import { parseDaysToBlocks } from "~/util";

type Props = { setOpen: (open: boolean) => void };

function VotingPeriod({ setOpen }: Props) {
  const [description, setDescription] = useState("");
  const [period, setPeriod] = useState("");
  const ICVCMGovernor = useICVCMGovernor();

  const [_, submit] = useAsync(submitProposal);
  const { data } = useSWR(ICVCMGovernor ? "getVotingPeriod" : null, async () =>
    getVotingPeriod(ICVCMGovernor)
  );

  useEffect(() => {
    if (data) {
      setPeriod(data.toString());
    }
  }, [data]);

  async function submitProposal() {
    setOpen(false);
    await proposeVotingPeriod(
      ICVCMGovernor,
      description,
      parseDaysToBlocks(Number(period))
    );
  }

  const handleChangeDescription = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDescription(event.target.value);
  };

  const handleChangePeriod = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPeriod(event.target.value);
  };

  return (
    <Stack spacing={2}>
      <TextField
        label="Description"
        multiline
        onChange={handleChangeDescription}
      />
      <TextField
        label="Voting Period"
        type="number"
        InputLabelProps={{
          shrink: true,
        }}
        value={period}
        onChange={handleChangePeriod}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              days ≈ {parseDaysToBlocks(Number(period))} Blocks
            </InputAdornment>
          ),
        }}
      />

      <Button
        variant="contained"
        disabled={!period || data.toString() === period || Number(period) < 0}
        onClick={submit}
      >
        Propose
      </Button>
    </Stack>
  );
}

export default VotingPeriod;
