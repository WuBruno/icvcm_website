import { Button, Stack, TextField } from "@mui/material";
import React, { useState } from "react";
import { useAsync } from "~/hooks/common";
import { useICVCMConstitution, useICVCMGovernor } from "~/hooks/contracts";
import { proposeAddPrinciple } from "~/services/proposals";

type Props = { setOpen: (open: boolean) => void };

function AddPrinciple({ setOpen }: Props) {
  const [description, setDescription] = useState("");
  const [principles, setPrinciples] = useState("");
  const ICVCMGovernor = useICVCMGovernor();
  const ICVCMConstitution = useICVCMConstitution();
  const [_, submit] = useAsync(submitProposal);

  async function submitProposal() {
    setOpen(false);
    await proposeAddPrinciple(
      ICVCMGovernor,
      ICVCMConstitution,
      description,
      principles
    );
  }

  const handleChangeDescription = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDescription(event.target.value);
  };

  const handleChangePrinciples = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPrinciples(event.target.value);
  };

  return (
    <Stack spacing={2}>
      <TextField
        label="Description"
        multiline
        onChange={handleChangeDescription}
      />
      <TextField
        label="New CCP"
        multiline
        value={principles}
        onChange={handleChangePrinciples}
      />

      <Button variant="contained" disabled={!principles} onClick={submit}>
        Propose
      </Button>
    </Stack>
  );
}

export default AddPrinciple;
