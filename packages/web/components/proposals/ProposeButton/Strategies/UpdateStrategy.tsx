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
import { getStrategies } from "~/services/constitution";
import { proposeUpdateStrategy } from "~/services/proposals";

type Props = { setOpen: (open: boolean) => void };

function UpdateStrategy({ setOpen }: Props) {
  const [description, setDescription] = useState("");
  const [strategy, setStrategy] = useState("");
  const [index, setIndex] = useState("");

  const ICVCMGovernor = useICVCMGovernor();
  const ICVCMConstitution = useICVCMConstitution();
  const [_, submit] = useAsync(submitProposal);
  const { data } = useSWR(
    ICVCMConstitution ? "getStrategies" : null,
    async () => getStrategies(ICVCMConstitution)
  );

  async function submitProposal() {
    setOpen(false);
    await proposeUpdateStrategy(
      ICVCMGovernor,
      ICVCMConstitution,
      description,
      data[index].id,
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

  const handleChangeStrategyId = (event: SelectChangeEvent) => {
    setIndex(event.target.value);
    setStrategy(data[event.target.value].value);
  };

  return (
    <Stack spacing={2}>
      <TextField
        label="Description"
        multiline
        onChange={handleChangeDescription}
      />
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Strategy</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={index}
          label="Strategy"
          onChange={handleChangeStrategyId}
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
        label="Update Strategy"
        multiline
        disabled={index === ""}
        value={strategy}
        onChange={handleChangeStrategy}
      />

      <Button
        variant="contained"
        disabled={!strategy || strategy === data[index].value}
        onClick={submit}
      >
        Propose
      </Button>
    </Stack>
  );
}

export default UpdateStrategy;
