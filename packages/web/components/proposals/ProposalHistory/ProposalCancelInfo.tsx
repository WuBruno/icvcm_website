import { ListItem, ListItemAvatar, ListItemText } from "@mui/material";
import useSWR from "swr";
import { VoteSupport } from "~/@types";
import { useICVCMGovernor } from "~/hooks/contracts";
import { getProposalCancelEvent } from "~/services/proposals";
import SupportIcon from "./SupportIcon";

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
    <ListItem>
      <ListItemAvatar sx={{ marginRight: -2 }}>
        <SupportIcon support={VoteSupport.Against} />
      </ListItemAvatar>
      <ListItemText
        primary="Regulator Rejected Proposal"
        secondary={`${data[0].toLocaleString()} - Comment: ${data[1]}`}
      />
    </ListItem>
  );
};

export default ProposalCancelInfo;
