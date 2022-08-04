import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import DoDisturbOnOutlinedIcon from "@mui/icons-material/DoDisturbOnOutlined";
import {
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import useSWR from "swr";
import { Proposal, ProposalState, VoteSupport } from "~/@types";
import { Roles } from "~/@types/Roles";
import { useICVCMGovernor, useICVCMRoles } from "~/hooks/contracts";
import { getVotes } from "~/services/vote";

type Props = {
  proposal: Proposal;
};

type VoteIconProps = {
  support: VoteSupport;
};

const VoteIcon = ({ support }: VoteIconProps) => {
  switch (support) {
    case VoteSupport.For:
      return <CheckCircleOutlineIcon color="success" />;
    case VoteSupport.Against:
      return <CancelOutlinedIcon color="error" />;
    case VoteSupport.Abstain:
      return <DoDisturbOnOutlinedIcon color="warning" />;
  }
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

  return (
    <Box sx={{ maxWidth: 400 }}>
      <Stepper activeStep={activeStep} orientation="vertical">
        <Step key={0} expanded>
          <StepLabel>Proposal Creation</StepLabel>
          <StepContent>
            <ListItem>
              <Typography>
                Proposal created by {Roles[proposal.proposer.role]}{" "}
                {proposal.proposer.name} {proposal.time.toLocaleString()}
              </Typography>
            </ListItem>
          </StepContent>
        </Step>

        <Step key={1} expanded>
          <StepLabel>Proposal Voting</StepLabel>
          <StepContent>
            <List>
              {votes &&
                votes.map((vote) => (
                  <ListItem key={vote.voter.memberAddress}>
                    <ListItemAvatar sx={{ marginRight: -2 }}>
                      <VoteIcon support={vote.support} />
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
            <List>
              <ListItem>
                <ListItemIcon></ListItemIcon>
              </ListItem>
            </List>
          </StepContent>
        </Step>
      </Stepper>
    </Box>
  );
};

export default ProposalHistory;
