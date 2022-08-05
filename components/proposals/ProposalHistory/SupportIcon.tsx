import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import DoDisturbOnOutlinedIcon from "@mui/icons-material/DoDisturbOnOutlined";
import { VoteSupport } from "~/@types";

type SupportIconProps = {
  support: VoteSupport;
};

const SupportIcon = ({ support }: SupportIconProps) => {
  switch (support) {
    case VoteSupport.For:
      return <CheckCircleOutlineIcon color="success" />;
    case VoteSupport.Against:
      return <CancelOutlinedIcon color="error" />;
    case VoteSupport.Abstain:
      return <DoDisturbOnOutlinedIcon color="warning" />;
  }
};

export default SupportIcon;
