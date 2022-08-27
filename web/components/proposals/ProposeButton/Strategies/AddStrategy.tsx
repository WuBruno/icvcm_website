import { Button, Stack, TextField } from "@mui/material";
import React, { useState } from "react";
import { useAsync } from "~/hooks/common";
import { useICVCMConstitution, useICVCMGovernor } from "~/hooks/contracts";
import { proposeAddStrategy } from "~/services/proposals";

type Props = { setOpen: (open: boolean) => void };

function AddStrategy({ setOpen }: Props) {
  const [description, setDescription] = useState("");
  const [strategy, setStrategy] = useState("");

  const ICVCMGovernor = useICVCMGovernor();
  const ICVCMConstitution = useICVCMConstitution();
  const [_, submit] = useAsync(submitProposal);

  async function submitProposal() {
    setOpen(false);
    await proposeAddStrategy(
      ICVCMGovernor,
      ICVCMConstitution,
      description,
      strategy
    );
  }

  const handleChangeDescription = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDescription(event.target.value);
  };

  const handleChangeStrategy = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStrategy(event.target.value);
  };

  return (
    <Stack spacing={2}>
      <TextField
        label="Description"
        multiline
        onChange={handleChangeDescription}
      />
      <TextField
        label="New Strategy"
        multiline
        value={strategy}
        onChange={handleChangeStrategy}
      />

      <Button variant="contained" disabled={!strategy} onClick={submit}>
        Propose
      </Button>
    </Stack>
  );
}

export default AddStrategy;
