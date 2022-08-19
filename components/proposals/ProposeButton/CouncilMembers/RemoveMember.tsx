import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { ethers } from "ethers";
import React, { useState } from "react";
import useSWR from "swr";
import { Roles } from "~/@types/Roles";
import { useAsync } from "~/hooks/common";
import { useICVCMGovernor, useICVCMRoles } from "~/hooks/contracts";
import { getMembers } from "~/services/members";
import { proposeRemoveMember } from "~/services/proposals";

type Props = { setOpen: (open: boolean) => void };

function RemoveMember({ setOpen }: Props) {
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const ICVCMGovernor = useICVCMGovernor();
  const ICVCMRoles = useICVCMRoles();
  const [_, submit] = useAsync(submitProposal);
  const { data: members } = useSWR(ICVCMRoles ? "members" : null, async () =>
    getMembers(ICVCMRoles)
  );

  async function submitProposal() {
    setOpen(false);
    return proposeRemoveMember(ICVCMGovernor, ICVCMRoles, description, address);
  }

  const handleChangeDescription = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDescription(event.target.value);
  };

  const handleChangeAddress = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(event.target.value);
  };

  return (
    <Stack spacing={2}>
      <TextField
        label="Description"
        multiline
        onChange={handleChangeDescription}
      />

      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Member</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={address}
          label="Member"
          onChange={handleChangeAddress}
        >
          {members.map((member) => (
            <MenuItem key={member.memberAddress} value={member.memberAddress}>
              {ethers.utils.parseBytes32String(member.name)} -{" "}
              {Roles[member.role]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button variant="contained" disabled={!description} onClick={submit}>
        Propose
      </Button>
    </Stack>
  );
}

export default RemoveMember;
