import { Button, Stack } from "@mui/material";
import { Proposal, ProposalState } from "~/@types";
import { Roles } from "~/@types/Roles";
import { useAsync, useUser } from "~/hooks/common";
import { useICVCMGovernor } from "~/hooks/contracts";
import { cancelProposal, executeProposal } from "~/services/proposals";

type Props = {
  proposal: Proposal;
};

function ExecuteProposalButton({ proposal }: Props) {
  const ICVCMGovernor = useICVCMGovernor();
  const { user } = useUser();

  const [_, execute] = useAsync(async () =>
    executeProposal(ICVCMGovernor, proposal)
  );
  const [, executeCancel] = useAsync(async () =>
    cancelProposal(ICVCMGovernor, proposal)
  );

  const isRegulator = user && user.role === Roles.Regulator;

  switch (proposal.state) {
    case ProposalState.Succeeded:
      return (
        <Stack direction="row" justifyContent="flex-end" spacing={1}>
          <Button
            disabled={!isRegulator}
            variant="contained"
            color="success"
            onClick={() => execute()}
          >
            Execute
          </Button>
          <Button
            disabled={!isRegulator}
            variant="outlined"
            color="error"
            onClick={() => executeCancel()}
          >
            Cancel
          </Button>
        </Stack>
      );
    case ProposalState.Defeated:
      return (
        <Button variant="contained" disabled>
          Rejected
        </Button>
      );
    case ProposalState.Executed:
      return (
        <Button variant="contained" disabled>
          Executed
        </Button>
      );
    case ProposalState.Cancelled:
      return (
        <Button variant="contained" disabled>
          Cancelled
        </Button>
      );

    default:
      return null;
  }
}

export default ExecuteProposalButton;
