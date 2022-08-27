import { ListItem, ListItemAvatar, ListItemText } from "@mui/material";
import useSWR from "swr";
import { VoteSupport } from "~/@types";
import { useICVCMGovernor } from "~/hooks/contracts";
import { getProposalExecutionEvent } from "~/services/proposals";
import SupportIcon from "./SupportIcon";

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
    <ListItem>
      <ListItemAvatar sx={{ marginRight: -2 }}>
        <SupportIcon support={VoteSupport.For} />
      </ListItemAvatar>
      <ListItemText
        primary="Regulator Approved Proposal"
        secondary={data.toLocaleString()}
      />
    </ListItem>
  );
};

export default ProposalExecutedInfo;
