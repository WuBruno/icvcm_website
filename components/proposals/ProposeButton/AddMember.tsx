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
import React, { useState } from "react";
import { Roles } from "~/@types/Roles";
import { useAsync } from "~/hooks/common";
import { useICVCMGovernor, useICVCMRoles } from "~/hooks/contracts";
import { proposeAddMember } from "~/services/proposals";

type Props = { setOpen: (open: boolean) => void };

function AddMember({ setOpen }: Props) {
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState(Roles.Director);
  const [address, setAddress] = useState("");
  const ICVCMGovernor = useICVCMGovernor();
  const ICVCMRoles = useICVCMRoles();
  const [_, submit] = useAsync(submitProposal);

  async function submitProposal() {
    setOpen(false);
    return proposeAddMember(
      ICVCMGovernor,
      ICVCMRoles,
      description,
      name,
      role,
      address
    );
  }

  const handleChangeDescription = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDescription(event.target.value);
  };

  const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleChangeAddress = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(event.target.value);
  };

  const handleChangeRole = (event: SelectChangeEvent<Roles>) => {
    setRole(event.target.value as Roles);
  };

  return (
    <Stack spacing={2}>
      <TextField
        label="Description"
        multiline
        onChange={handleChangeDescription}
      />
      <TextField label="Name" value={name} onChange={handleChangeName} />

      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Role</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={role}
          label="Role"
          onChange={handleChangeRole}
        >
          <MenuItem value={Roles.Director}>Director</MenuItem>
          <MenuItem value={Roles.Expert}>Expert</MenuItem>
          <MenuItem value={Roles.Secretariat}>Secretariat</MenuItem>
        </Select>
      </FormControl>

      <TextField
        label="Address"
        value={address}
        onChange={handleChangeAddress}
      />

      <Button
        variant="contained"
        disabled={!name || !ethers.utils.isAddress(address)}
        onClick={submit}
      >
        Propose
      </Button>
    </Stack>
  );
}

export default AddMember;
