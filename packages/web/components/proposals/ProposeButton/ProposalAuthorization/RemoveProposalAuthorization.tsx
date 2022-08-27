import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import useSWR from "swr";
import { Contracts, Roles } from "~/@types/Roles";
import { useAsync } from "~/hooks/common";
import { useICVCMGovernor, useICVCMRoles } from "~/hooks/contracts";
import { getProposalAuthorizations } from "~/services/members";
import {
  parseFunctionName,
  proposeRemoveProposalAuthorization,
} from "~/services/proposals";

type Props = { setOpen: (open: boolean) => void };

function RemoveProposalAuthorization({ setOpen }: Props) {
  const [description, setDescription] = useState("");
  const [index, setIndex] = useState<number>(0);
  const ICVCMGovernor = useICVCMGovernor();
  const ICVCMRoles = useICVCMRoles();
  const [_, submit] = useAsync(submitProposal);
  const { data: proposalAuthorizations } = useSWR(
    ICVCMRoles ? "getProposalAuthorizations" : null,
    async () => getProposalAuthorizations(ICVCMRoles)
  );

  async function submitProposal() {
    setOpen(false);
    return proposeRemoveProposalAuthorization(
      ICVCMGovernor,
      description,
      proposalAuthorizations[index]
    );
  }

  const handleChangeDescription = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDescription(event.target.value);
  };

  const handleChangeAddress = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIndex(Number(event.target.value));
  };

  return (
    <Stack spacing={2}>
      <TextField
        label="Description"
        multiline
        onChange={handleChangeDescription}
      />

      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">
          Proposal Authorization
        </InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={index}
          label="Proposal Authorization"
          onChange={handleChangeAddress}
        >
          {proposalAuthorizations?.map((item, i) => (
            <MenuItem
              key={
                item.function + item.contract.toString() + item.role.toString()
              }
              value={i}
            >
              {Roles[item.role]} to {parseFunctionName(item.function)} to{" "}
              {Contracts[item.contract]}
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

export default RemoveProposalAuthorization;
