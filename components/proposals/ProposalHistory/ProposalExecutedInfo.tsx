import { ListItemText } from "@mui/material";
import useSWR from "swr";
import { useICVCMGovernor } from "~/hooks/contracts";
import { getProposalExecutionEvent } from "~/services/proposals";

type Props = {
  proposalId: string;
};

const ProposalExecutedInfo = ({ proposalId }: Props) => {
  const ICVCMGovernor = useICVCMGovernor();
  const { data } = useSWR(["getProposalExecutionEvent", proposalId], async () =>
    getProposalExecutionEvent(ICVCMGovernor, proposalId)
  );

  if (!data) return null;

  return (
    <ListItemText
      primary="Regulator Approved Proposal"
      secondary={data.toLocaleString()}
    />
  );
};

export default ProposalExecutedInfo;
