import { ListItemText } from "@mui/material";
import { Proposal, ProposalState } from "~/@types";
import ProposalCancelInfo from "./ProposalCancelInfo";
import ProposalExecutedInfo from "./ProposalExecutedInfo";

type FinalDecisionInfoProps = {
  proposal: Proposal;
};

const FinalDecisionInfo = ({ proposal }: FinalDecisionInfoProps) => {
  switch (proposal.state) {
    case ProposalState.Executed:
      return <ProposalExecutedInfo proposalId={proposal.proposalId} />;

    case ProposalState.Cancelled:
      return <ProposalCancelInfo proposalId={proposal.proposalId} />;

    case ProposalState.Succeeded:
      return (
        <ListItemText
          primary="Voting Succeeded"
          secondary="Waiting for Regulator's Final Decision"
        />
      );

    case ProposalState.Defeated:
      return (
        <ListItemText
          primary="Proposal Defeated"
          secondary="Consensus against the proposal"
        />
      );

    case ProposalState.Expired:
      return (
        <ListItemText
          primary="Proposal Voting Expired"
          secondary="Unable to reach quorum before end of voting period"
        />
      );

    case ProposalState.Active:
    case ProposalState.Pending:
    case ProposalState.Queued:
    default:
      return null;
  }
};

export default FinalDecisionInfo;
