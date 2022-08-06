import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { Collapse, IconButton, TableCell, TableRow } from "@mui/material";
import { useState } from "react";
import { Proposal, ProposalState } from "~/@types";
import { VoteButton } from "../vote";
import ProposalInfo from "./ProposalInfo";

type Props = {
  proposal: Proposal;
};

const ActiveProposalItem = ({ proposal }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow
        key={proposal.proposalId}
        sx={{
          "& > *": { borderBottom: "unset" },
          "&:last-child td, &:last-child th": { border: 0 },
        }}
      >
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {proposal.description}
        </TableCell>
        <TableCell align="right">{proposal.proposer.name}</TableCell>
        <TableCell align="right">{ProposalState[proposal.state]}</TableCell>
        <TableCell align="right">
          <VoteButton proposal={proposal} />
        </TableCell>
      </TableRow>
      <TableRow sx={{ "& > *": { borderTop: "unset" } }}>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <ProposalInfo proposal={proposal} />
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default ActiveProposalItem;
