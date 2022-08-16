import {
  Button,
  Modal,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Roles } from "~/@types/Roles";
import { useUser } from "~/hooks/common";

import AddMember from "./AddMember";
import EditPrinciple from "./EditPrinciple";
import EditStrategy from "./EditStrategy";
import RemoveMember from "./RemoveMember";
import VotingPeriod from "./VotingPeriod";
import VotingQuorum from "./VotingQuorum";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 1000,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

enum ProposalType {
  EditPrinciple,
  EditStrategy,
  AddMember,
  RemoveMember,
  VotingQuorum,
  VotingPeriod,
}

const ProposeButton = () => {
  const [open, setOpen] = useState(false);
  const [proposalType, setProposalType] = useState<ProposalType>(
    ProposalType.EditPrinciple
  );

  const { user } = useUser();
  const canPropose =
    !user ||
    ![Roles.Director, Roles.Expert, Roles.Secretariat].includes(user.role);

  const handleChangeProposalType = (
    event: React.MouseEvent<HTMLElement>,
    _proposalType: ProposalType
  ) => {
    setProposalType(_proposalType);
  };

  const ProposalComponent = () => {
    switch (proposalType) {
      case ProposalType.EditPrinciple:
        return <EditPrinciple setOpen={setOpen} />;

      case ProposalType.EditStrategy:
        return <EditStrategy setOpen={setOpen} />;

      case ProposalType.AddMember:
        return <AddMember setOpen={setOpen} />;

      case ProposalType.RemoveMember:
        return <RemoveMember setOpen={setOpen} />;

      case ProposalType.VotingQuorum:
        return <VotingQuorum setOpen={setOpen} />;
      case ProposalType.VotingPeriod:
        return <VotingPeriod setOpen={setOpen} />;

      default:
        return null;
    }
  };

  return (
    <div>
      <Button
        variant="contained"
        sx={{ marginY: 2 }}
        onClick={() => setOpen(true)}
        disabled={canPropose}
      >
        Create Proposal
      </Button>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Stack spacing={2} sx={style}>
          <Typography variant="h5">Create Proposal</Typography>

          <ToggleButtonGroup
            color="primary"
            size="small"
            value={proposalType}
            exclusive
            onChange={handleChangeProposalType}
          >
            <ToggleButton value={ProposalType.EditPrinciple}>
              Carbon Credit Principles
            </ToggleButton>
            <ToggleButton value={ProposalType.EditStrategy}>
              Strategic Decisions
            </ToggleButton>
            <ToggleButton value={ProposalType.AddMember}>
              New Member
            </ToggleButton>
            <ToggleButton value={ProposalType.RemoveMember}>
              Remove Member
            </ToggleButton>
            <ToggleButton value={ProposalType.VotingQuorum}>
              Voting Quorum
            </ToggleButton>
            <ToggleButton value={ProposalType.VotingPeriod}>
              Voting Period
            </ToggleButton>
          </ToggleButtonGroup>

          <ProposalComponent />
        </Stack>
      </Modal>
    </div>
  );
};

export default ProposeButton;
