import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { isNumber } from "lodash";
import React, { useState } from "react";
import useSWR from "swr";
import { Contracts, Roles } from "~/@types/Roles";
import { useAsync } from "~/hooks/common";
import { useICVCMGovernor, useICVCMRoles } from "~/hooks/contracts";
import { getProposalAuthorizations } from "~/services/members";
import {
  FunctionContracts,
  functionNames,
  proposeAddProposalAuthorization,
} from "~/services/proposals";

type Props = { setOpen: (open: boolean) => void };

function AddProposalAuthorization({ setOpen }: Props) {
  const [description, setDescription] = useState("");
  const [functionIndex, setFunctionIndex] = useState(0);
  const [role, setRole] = useState("");
  const ICVCMGovernor = useICVCMGovernor();
  const ICVCMRoles = useICVCMRoles();
  const [_, submit] = useAsync(submitProposal);
  const { data: proposalAuthorizations } = useSWR(
    ICVCMRoles ? "getProposalAuthorizations" : null,
    async () => getProposalAuthorizations(ICVCMRoles)
  );

  async function submitProposal() {
    setOpen(false);
    return proposeAddProposalAuthorization(ICVCMGovernor, description, {
      contract: FunctionContracts[functionIndex][1],
      function: FunctionContracts[functionIndex][0],
      role: Number(role),
    });
  }

  const handleChangeDescription = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDescription(event.target.value);
  };

  const handleChangeFunction = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFunctionIndex(Number(event.target.value));
  };
  const handleChangeRole = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRole(Number(event.target.value));
  };

  return (
    <Stack spacing={2}>
      <TextField
        label="Description"
        multiline
        onChange={handleChangeDescription}
      />

      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Proposal Type</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={functionIndex}
          label="Proposal Type"
          onChange={handleChangeFunction}
        >
          {FunctionContracts.map(([key, value], index) => (
            <MenuItem key={key} value={index.toString()}>
              {functionNames[key]} in {Contracts[value]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth>
        <InputLabel id="role-select">Role</InputLabel>
        <Select
          labelId="role-select"
          id="role"
          value={role || ""}
          label="Role"
          disabled={functionIndex === undefined}
          onChange={handleChangeRole}
        >
          {functionIndex !== undefined &&
            Object.values(Roles)
              .filter((v) => isNumber(v))
              .filter((v: Roles) => {
                return !proposalAuthorizations.find(
                  (x) =>
                    x.function === FunctionContracts[functionIndex][0] &&
                    x.role === v &&
                    x.contract === FunctionContracts[functionIndex][1]
                );
              })
              .map((key) => (
                <MenuItem key={key} value={key}>
                  {Roles[key]}
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

export default AddProposalAuthorization;
