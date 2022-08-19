import { Box, Stack, Typography } from "@mui/material";
import { Proposal } from "~/@types";
import { Contracts, Roles } from "~/@types/Roles";
import { parseFunctionName } from "~/services/proposals";
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
      case "addPrinciple":
        return (
          <Stack>
            <Typography gutterBottom>
              Action: <b>Add New CCP</b>
            </Typography>
            <Typography>Proposed Principle: </Typography>
            <Typography paragraph variant="body2">
              {proposalAction.payload.principle}
            </Typography>
          </Stack>
        );
      case "updatePrinciple":
        return (
          <Stack>
            <Typography gutterBottom>
              Action: <b>Update Existing CCP</b>
            </Typography>
            <Typography>Proposed Update: </Typography>
            <Typography paragraph variant="body2">
              {proposalAction.payload.id.toString()}:
              {proposalAction.payload.principle}
            </Typography>
          </Stack>
        );
      case "removePrinciple":
        return (
          <Stack>
            <Typography gutterBottom>
              Action: <b>Remove CCP</b>
            </Typography>
            <Typography paragraph variant="body2">
              Remove CCP ID:{proposalAction.payload.id.toString()}:
            </Typography>
          </Stack>
        );
      case "addStrategy":
        return (
          <Stack>
            <Typography gutterBottom>
              Action: <b>Add New Strategy</b>
            </Typography>
            <Typography>Proposed New Strategy: </Typography>
            <Typography paragraph variant="body2">
              {proposalAction.payload.strategy}
            </Typography>
          </Stack>
        );
      case "updateStrategy":
        return (
          <Stack>
            <Typography gutterBottom>
              Action: <b>Update Existing Strategy</b>
            </Typography>
            <Typography>Proposed Update: </Typography>
            <Typography paragraph variant="body2">
              {proposalAction.payload.id.toString()}:
              {proposalAction.payload.strategy}
            </Typography>
          </Stack>
        );
      case "removeStrategy":
        return (
          <Stack>
            <Typography gutterBottom>
              Action: <b>Remove Strategy</b>
            </Typography>
            <Typography paragraph variant="body2">
              Remove Strategy ID:{proposalAction.payload.id.toString()}:
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
      case "upgradeTo":
        return (
          <Stack>
            <Typography gutterBottom>
              Action: <b>Upgrade Contract</b>
            </Typography>
            <Typography>Upgrade details:</Typography>
            <Typography variant="body2">
              Contract: {Contracts[proposalAction.payload.contract]}
            </Typography>
            <Typography variant="body2">
              Address: <b>{proposalAction.payload.contract}</b>
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
