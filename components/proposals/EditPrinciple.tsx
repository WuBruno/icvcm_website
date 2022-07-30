import { Button, Stack, TextField } from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import React, { useEffect, useState } from "react";
import useSWR from "swr";
import { useAsync } from "~/hooks/common";
import { useICVCMConstitution, useICVCMGovernor } from "~/hooks/contracts";
import { getPrinciples } from "~/services/constitution";
import { proposePrinciple } from "~/services/proposals";

type Props = { setOpen: (open: boolean) => void };

function EditPrinciple({ setOpen }: Props) {
  const [description, setDescription] = useState("");
  const [principles, setPrinciples] = useState("");
  const ICVCMGovernor = useICVCMGovernor();
  const ICVCMConstitution = useICVCMConstitution();
  const { account } = useWeb3React();
  const [_, submit] = useAsync(submitProposal);
  const { data, error } = useSWR(
    ICVCMConstitution ? "principles" : null,
    async () => getPrinciples(ICVCMConstitution)
  );

  useEffect(() => {
    console.log("Principles data", data);

    if (data) {
      setPrinciples(data);
    }
  }, [data]);

  async function submitProposal() {
    setOpen(false);
    const proposalId = await proposePrinciple(
      ICVCMGovernor,
      ICVCMConstitution,
      principles,
      description
    );
    console.log(proposalId);
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
        label="Edit Carbon Credit Principles"
        multiline
        value={principles}
        onChange={handleChangePrinciples}
      />

      <Button
        variant="contained"
        disabled={!principles || data === principles}
        onClick={submit}
      >
        Propose
      </Button>
    </Stack>
  );
}

export default EditPrinciple;
