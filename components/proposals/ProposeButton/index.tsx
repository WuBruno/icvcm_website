import {
  Button,
  Modal,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import useSWR from "swr";
import { useUser } from "~/hooks/common";
import { useICVCMRoles } from "~/hooks/contracts";
import { getProposalAuthorizations } from "~/services/members";

import AddMember from "./AddMember";
import AddProposalAuthorization from "./AddProposalAuthorization";
import EditPrinciple from "./EditPrinciple";
import EditStrategy from "./EditStrategy";
import RemoveMember from "./RemoveMember";
import { default as RemoveProposalAuthorization } from "./RemoveProposalAuthorization";
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
  AddProposalAuthorization,
  RemoveProposalAuthorization,
}

const ProposeButton = () => {
  const [open, setOpen] = useState(false);
  const [proposalType, setProposalType] = useState<ProposalType>(
    ProposalType.EditPrinciple
  );
  const ICVCMRoles = useICVCMRoles();
  const { data } = useSWR(
    ICVCMRoles ? "getProposalAuthorizations" : null,
    async () => getProposalAuthorizations(ICVCMRoles)
  );
  const { user } = useUser();
  const authorizations = useMemo(() => {
    if (user && data) {
      return data.filter((p) => p.role == user.role).map((p) => p.function);
    }
    return;
  }, [user, data]);
  console.log(authorizations);

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
      case ProposalType.AddProposalAuthorization:
        return <AddProposalAuthorization setOpen={setOpen} />;
      case ProposalType.RemoveProposalAuthorization:
        return <RemoveProposalAuthorization setOpen={setOpen} />;

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
        disabled={!authorizations?.length}
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
            <ToggleButton
              value={ProposalType.EditPrinciple}
              disabled={!authorizations?.includes("setPrinciples")}
            >
              Carbon Credit Principles
            </ToggleButton>
            <ToggleButton
              value={ProposalType.EditStrategy}
              disabled={!authorizations?.includes("setStrategies")}
            >
              Strategic Decisions
            </ToggleButton>
            <ToggleButton
              value={ProposalType.AddMember}
              disabled={!authorizations?.includes("addMember")}
            >
              Add Member
            </ToggleButton>
            <ToggleButton
              value={ProposalType.RemoveMember}
              disabled={!authorizations?.includes("removeMember")}
            >
              Remove Member
            </ToggleButton>
            <ToggleButton
              value={ProposalType.VotingQuorum}
              disabled={!authorizations?.includes("updateQuorumNumerator")}
            >
              Voting Quorum
            </ToggleButton>
            <ToggleButton
              value={ProposalType.VotingPeriod}
              disabled={!authorizations?.includes("setVotingPeriod")}
            >
              Voting Period
            </ToggleButton>
            <ToggleButton
              value={ProposalType.AddProposalAuthorization}
              disabled={!authorizations?.includes("addProposalAuthorization")}
            >
              Add Proposal Authorization
            </ToggleButton>
            <ToggleButton
              value={ProposalType.RemoveProposalAuthorization}
              disabled={
                !authorizations?.includes("removeProposalAuthorization")
              }
            >
              Remove Proposal Authorization
            </ToggleButton>
          </ToggleButtonGroup>

          <ProposalComponent />
        </Stack>
      </Modal>
    </div>
  );
};

export default ProposeButton;
