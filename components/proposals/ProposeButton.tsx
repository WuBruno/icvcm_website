import {
  Button,
  Modal,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { AddMember, EditPrinciple, EditStrategy, RemoveMember } from ".";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
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
}

const ProposeButton = () => {
  const [open, setOpen] = useState(false);
  const [proposalType, setProposalType] = useState<ProposalType>(
    ProposalType.EditPrinciple
  );

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
          </ToggleButtonGroup>

          <ProposalComponent />
        </Stack>
      </Modal>
    </div>
  );
};

export default ProposeButton;
