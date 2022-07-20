import { Button, Stack, TextField } from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import React, { useEffect, useState } from "react";
import useSWR from "swr";
import {
  useAsync,
  useICVCMConstitution,
  useICVCMGovernor,
  useICVCMToken,
} from "~/hooks";
import { getPrinciples, getStrategies } from "~/services/constitution";
import {
  propose,
  proposePrinciple,
  proposeStrategy,
} from "~/services/proposals";

type Props = { setOpen: (open: boolean) => void };

function EditPrinciple({ setOpen }: Props) {
  const [description, setDescription] = useState("");
  const [strategies, setStrategies] = useState("");
  const ICVCMGovernor = useICVCMGovernor();
  const ICVCMToken = useICVCMToken();
  const ICVCMConstitution = useICVCMConstitution();
  const { account } = useWeb3React();
  const [_, submit] = useAsync(submitProposal);
  const { data, error } = useSWR(
    ICVCMConstitution ? "strategies" : null,
    async () => getStrategies(ICVCMConstitution)
  );

  useEffect(() => {
    if (data) {
      setStrategies(data);
    }
  }, [data]);

  async function submitProposal() {
    setOpen(false);
    const proposalId = await proposeStrategy(
      ICVCMGovernor,
      ICVCMConstitution,
      strategies,
      description
    );
    console.log(proposalId);
  }

  const handleChangeDescription = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDescription(event.target.value);
  };

  const handleChangeStrategy = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStrategies(event.target.value);
  };

  return (
    <Stack spacing={2}>
      <TextField
        label="Description"
        multiline
        onChange={handleChangeDescription}
      />
      <TextField
        label="Edit Strategic Decisions"
        multiline
        value={strategies}
        onChange={handleChangeStrategy}
      />

      <Button
        variant="contained"
        disabled={!strategies || data === strategies}
        onClick={submit}
      >
        Propose
      </Button>
    </Stack>
  );
}

export default EditPrinciple;
