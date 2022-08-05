import { ListItemText } from "@mui/material";
import useSWR from "swr";
import { useICVCMGovernor } from "~/hooks/contracts";
import { getProposalCancelEvent } from "~/services/proposals";

type Props = {
  proposalId: string;
};

const ProposalCancelInfo = ({ proposalId }: Props) => {
  const ICVCMGovernor = useICVCMGovernor();
  const { data } = useSWR(["getProposalCancelEvent", proposalId], async () =>
    getProposalCancelEvent(ICVCMGovernor, proposalId)
  );

  if (!data) return null;

  return (
    <ListItemText
      primary="Regulator Rejected Proposal"
      secondary={data.toLocaleString()}
    />
  );
};

export default ProposalCancelInfo;
