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
import { ethers } from "ethers";
import { isNumber } from "lodash";
import React, { useState } from "react";
import { Contracts, Roles } from "~/@types/Roles";
import { useAsync } from "~/hooks/common";
import { useICVCMGovernor } from "~/hooks/contracts";
import { proposeUpgradeContract } from "~/services/proposals";

type Props = { setOpen: (open: boolean) => void };

function UpgradeContract({ setOpen }: Props) {
  const ICVCMGovernor = useICVCMGovernor();

  const [description, setDescription] = useState("");
  const [contract, setContract] = useState(0);
  const [address, setAddress] = useState("");
  const [_, submit] = useAsync(submitProposal);

  async function submitProposal() {
    setOpen(false);
    return proposeUpgradeContract(
      ICVCMGovernor,
      description,
      contract,
      address
    );
  }

  const handleChangeDescription = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDescription(event.target.value);
  };

  const handleChangeAddress = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(event.target.value);
  };

  const handleChangeRole = (event: SelectChangeEvent<Roles>) => {
    setContract(Number(event.target.value));
  };

  return (
    <Stack spacing={2}>
      <TextField
        label="Description"
        multiline
        onChange={handleChangeDescription}
      />

      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Contract</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={contract}
          label="Contract"
          onChange={handleChangeRole}
        >
          {Object.values(Contracts)
            .filter((v) => isNumber(v))
            .map((key) => (
              <MenuItem key={key} value={key}>
                {Contracts[key]}
              </MenuItem>
            ))}
        </Select>
      </FormControl>

      <TextField
        label="Implementation Address"
        value={address}
        onChange={handleChangeAddress}
      />

      <Button
        variant="contained"
        disabled={!ethers.utils.isAddress(address)}
        onClick={submit}
      >
        Propose
      </Button>
    </Stack>
  );
}

export default UpgradeContract;
