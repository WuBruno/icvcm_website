import { Box, Stack, Typography } from "@mui/material";
import { Proposal } from "~/@types";
import { Roles } from "~/@types/Roles";
import ProposalHistory from "./ProposalHistory";

type Props = {
  proposal: Proposal;
};

const ProposalInfo = ({ proposal }: Props) => {
  const ProposalActionInfo = () => {
    const { proposalAction } = proposal;
    switch (proposalAction.action) {
      case "addMember":
        return (
          <Stack>
            <Typography gutterBottom>
              Action: <b>Adding Member</b>
            </Typography>
            <Typography>Member Details:</Typography>
            <Typography variant="body2">
              Name: <b>{proposalAction.payload.member.name}</b>
            </Typography>
            <Typography variant="body2">
              Role: <b>{Roles[proposalAction.payload.member.role]}</b>
            </Typography>
            <Typography variant="body2">
              Address: <b>{proposalAction.payload.member.memberAddress}</b>
            </Typography>
          </Stack>
        );

      case "removeMember":
        return (
          <Stack>
            <Typography>
              Action: <b>Removing Member</b>
            </Typography>
            <Typography>Member Details:</Typography>
            <Typography variant="body2">
              Name: <b>{proposalAction.payload.member.name}</b>
            </Typography>
            <Typography variant="body2">
              Role: <b>{Roles[proposalAction.payload.member.role]}</b>
            </Typography>
            <Typography variant="body2">
              Address: <b>{proposalAction.payload.member.memberAddress}</b>
            </Typography>
          </Stack>
        );
      case "editPrinciples":
        return (
          <Stack>
            <Typography>
              Action: <b>Editing Principles</b>
            </Typography>
            <Typography>Proposed Principles: </Typography>
            <Typography variant="body2">
              {proposalAction.payload.principles}
            </Typography>
          </Stack>
        );
      case "editStrategies":
        return (
          <Stack>
            <Typography>
              Action: <b>Editing Strategies</b>
            </Typography>
            <Typography>Proposed New Strategies: </Typography>
            <Typography variant="body2">
              {proposalAction.payload.strategies}
            </Typography>
          </Stack>
        );
    }
  };
  return (
    <Box sx={{ margin: 1 }}>
      <Typography variant="h6">Proposal Information</Typography>
      <ProposalActionInfo />
      <Typography variant="h6" gutterBottom component="div" mt={3}>
        History
      </Typography>
      <ProposalHistory proposal={proposal} />
    </Box>
  );
};

export default ProposalInfo;
