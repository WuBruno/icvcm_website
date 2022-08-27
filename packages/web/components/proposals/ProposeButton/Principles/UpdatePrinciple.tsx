import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import useSWR from "swr";
import { useAsync } from "~/hooks/common";
import { useICVCMConstitution, useICVCMGovernor } from "~/hooks/contracts";
import { getPrinciples } from "~/services/constitution";
import { proposeUpdatePrinciple } from "~/services/proposals";

type Props = { setOpen: (open: boolean) => void };

function UpdatePrinciple({ setOpen }: Props) {
  const [description, setDescription] = useState("");
  const [principles, setPrinciples] = useState("");
  const [index, setIndex] = useState("");

  const ICVCMGovernor = useICVCMGovernor();
  const ICVCMConstitution = useICVCMConstitution();
  const [_, submit] = useAsync(submitProposal);
  const { data } = useSWR(
    ICVCMConstitution ? "getPrinciples" : null,
    async () => getPrinciples(ICVCMConstitution)
  );

  async function submitProposal() {
    setOpen(false);
    await proposeUpdatePrinciple(
      ICVCMGovernor,
      ICVCMConstitution,
      description,
      data[index].id,
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

  const handleChangePrincipleId = (event: SelectChangeEvent) => {
    setIndex(event.target.value);
    setPrinciples(data[event.target.value].value);
  };

  return (
    <Stack spacing={2}>
      <TextField
        label="Description"
        multiline
        onChange={handleChangeDescription}
      />
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Principle</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={index}
          label="Principle"
          onChange={handleChangePrincipleId}
          disabled={!data?.length}
        >
          {data &&
            data.map(({ id, value }, index) => (
              <MenuItem key={id.toString()} value={index}>
                {id.toString()}. {value}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
      <TextField
        label="Update CCP"
        multiline
        disabled={index === ""}
        value={principles}
        onChange={handleChangePrinciples}
      />

      <Button
        variant="contained"
        disabled={!principles || principles === data[index].value}
        onClick={submit}
      >
        Propose
      </Button>
    </Stack>
  );
}

export default UpdatePrinciple;
