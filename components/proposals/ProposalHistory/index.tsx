import {
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import { useMemo } from "react";
import useSWR from "swr";
import { Proposal, ProposalState, VoteSupport } from "~/@types";
import { Roles } from "~/@types/Roles";
import { useICVCMGovernor, useICVCMRoles } from "~/hooks/contracts";
import { getVotes } from "~/services/vote";
import FinalDecisionInfo from "./FinalDecisionInfo";
import SupportIcon from "./SupportIcon";

type Props = {
  proposal: Proposal;
};

const ProposalHistory = ({ proposal }: Props) => {
  const activeStep = [ProposalState.Active, ProposalState.Pending].includes(
    proposal.state
  )
    ? 1
    : 2;
  const ICVCMGovernor = useICVCMGovernor();
  const ICVCMRoles = useICVCMRoles();
  const { data: votes } = useSWR(["getVote", proposal.proposalId], async () =>
    getVotes(ICVCMGovernor, ICVCMRoles, proposal.proposalId)
  );

  const [totalCount, forCount, abstainCount, againstCount] = useMemo(() => {
    let forCount = 0;
    let abstainCount = 0;
    let againstCount = 0;

    if (!votes) {
      return [0, 0, 0];
    }

    for (const vote of votes) {
      if (vote.support === VoteSupport.For) forCount++;
      else if (vote.support === VoteSupport.Against) againstCount++;
      else if (vote.support === VoteSupport.Abstain) abstainCount++;
    }

    return [votes.length, forCount, abstainCount, againstCount];
  }, [votes]);

  return (
    <Box sx={{ maxWidth: 400 }}>
      <Stepper activeStep={activeStep} orientation="vertical">
        <Step key={0} expanded>
          <StepLabel>Proposal Creation</StepLabel>
          <StepContent>
            <ListItem>
              <ListItemText
                primary={`Proposal created by ${Roles[proposal.proposer.role]}
              ${proposal.proposer.name}`}
                secondary={proposal.time.toLocaleString()}
              />
            </ListItem>
          </StepContent>
        </Step>

        <Step key={1} expanded>
          <StepLabel>Proposal Voting</StepLabel>
          <StepContent>
            <ListItem>
              <Typography>
                For: {forCount} Abstain: {abstainCount} Against: {againstCount}
              </Typography>
              <Typography>Total: {totalCount}</Typography>
            </ListItem>

            <List>
              {votes &&
                votes.map((vote) => (
                  <ListItem key={vote.voter.memberAddress}>
                    <ListItemAvatar sx={{ marginRight: -2 }}>
                      <SupportIcon support={vote.support} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${vote.voter.name} has voted ${
                        VoteSupport[vote.support]
                      }`}
                      secondary={vote.time.toLocaleString()}
                    />
                  </ListItem>
                ))}
            </List>
          </StepContent>
        </Step>

        <Step key={2} expanded>
          <StepLabel>Final Decision</StepLabel>
          <StepContent>
            <ListItem>
              <FinalDecisionInfo proposal={proposal} />
            </ListItem>
          </StepContent>
        </Step>
      </Stepper>
    </Box>
  );
};

export default ProposalHistory;
