import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import {
  Box,
  Collapse,
  IconButton,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Proposal, ProposalState } from "~/@types";
import ExecuteProposalButton from "./ExecuteProposalButton";
import ProposalHistory from "./ProposalHistory";

type Props = {
  proposal: Proposal;
};

const CompletedProposalItem = ({ proposal }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow
        key={proposal.proposalId}
        sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
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
          <ExecuteProposalButton proposal={proposal} />
        </TableCell>
      </TableRow>
      <TableRow sx={{ "& > *": { borderTop: "unset" } }}>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                History
              </Typography>
              <ProposalHistory proposal={proposal} />
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default CompletedProposalItem;
