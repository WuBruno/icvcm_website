import { Box, Stack, Typography } from "@mui/material";
import { Proposal } from "~/@types";
import { Roles } from "~/@types/Roles";
import { parseFunctionName } from "~/services/members";
import { parseBlockToDays } from "~/util";
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
            <Typography gutterBottom>
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
            <Typography gutterBottom>
              Action: <b>Editing Principles</b>
            </Typography>
            <Typography>Proposed Principles: </Typography>
            <Typography paragraph variant="body2">
              {proposalAction.payload.principles}
            </Typography>
          </Stack>
        );
      case "editStrategies":
        return (
          <Stack>
            <Typography gutterBottom>
              Action: <b>Editing Strategies</b>
            </Typography>
            <Typography>Proposed New Strategies: </Typography>
            <Typography paragraph variant="body2">
              {proposalAction.payload.strategies}
            </Typography>
          </Stack>
        );
      case "setVotingQuorum":
        return (
          <Stack>
            <Typography gutterBottom>
              Action: <b>Set Voting Quorum</b>
            </Typography>
            <Typography>
              Proposed New Voting Quorum: {proposalAction.payload.quorum}%
            </Typography>
          </Stack>
        );

      case "setVotingPeriod":
        return (
          <Stack>
            <Typography gutterBottom>
              Action: <b>Set Voting Period</b>
            </Typography>
            <Typography>
              Proposed New Voting Period:{" "}
              {parseBlockToDays(proposalAction.payload.votingPeriod)} days ≈{" "}
              {proposalAction.payload.votingPeriod} Blocks
            </Typography>
          </Stack>
        );
      case "addProposalAuthorization":
        return (
          <Stack>
            <Typography gutterBottom>
              Action: <b>Add Proposal Authorization</b>
            </Typography>
            <Typography>Role Authorization Added:</Typography>
            <Typography variant="body2">
              Proposal Type: {proposalAction.payload.function}
            </Typography>
            <Typography variant="body2">
              Role: <b>{Roles[proposalAction.payload.role]}</b>
            </Typography>
          </Stack>
        );
      case "removeProposalAuthorization":
        return (
          <Stack>
            <Typography gutterBottom>
              Action: <b>Remove Proposal Authorization</b>
            </Typography>
            <Typography>Role Authorization Removed:</Typography>
            <Typography variant="body2">
              Proposal Type:{" "}
              {parseFunctionName(proposalAction.payload.function)}
            </Typography>
            <Typography variant="body2">
              Role: <b>{Roles[proposalAction.payload.role]}</b>
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
