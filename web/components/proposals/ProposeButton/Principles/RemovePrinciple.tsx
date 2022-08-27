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
import { proposeRemovePrinciple } from "~/services/proposals";

type Props = { setOpen: (open: boolean) => void };

function RemovePrinciple({ setOpen }: Props) {
  const [description, setDescription] = useState("");
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
    await proposeRemovePrinciple(
      ICVCMGovernor,
      ICVCMConstitution,
      description,
      data[index].id
    );
  }

  const handleChangeDescription = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDescription(event.target.value);
  };

  const handleChangePrincipleId = (event: SelectChangeEvent) => {
    setIndex(event.target.value);
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

      <Button variant="contained" disabled={index === ""} onClick={submit}>
        Propose
      </Button>
    </Stack>
  );
}

export default RemovePrinciple;
