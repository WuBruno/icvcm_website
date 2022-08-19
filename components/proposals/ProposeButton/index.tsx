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
import CouncilMembers from "./CouncilMembers";
import Principles from "./Principles";
import ProposalAuthorization from "./ProposalAuthorization";
import Strategies from "./Strategies";
import UpgradeContract from "./UpgradeContract";
import VotingParameters from "./VotingParameters";

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

enum ProposalCategory {
  Principles,
  Strategies,
  CouncilMembers,
  VotingParameters,
  ProposalAuthorization,
  UpgradeContract,
}

const ProposeButton = () => {
  const ICVCMRoles = useICVCMRoles();
  const [open, setOpen] = useState(false);
  const [proposalCategory, setProposalCategory] = useState<ProposalCategory>();
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

  const handleChangeProposalType = (_, _proposalCategory: ProposalCategory) => {
    setProposalCategory(_proposalCategory);
  };

  const ProposalComponent = () => {
    switch (proposalCategory) {
      case ProposalCategory.Principles:
        return <Principles setOpen={setOpen} />;
      case ProposalCategory.Strategies:
        return <Strategies setOpen={setOpen} />;
      case ProposalCategory.CouncilMembers:
        return <CouncilMembers setOpen={setOpen} />;
      case ProposalCategory.VotingParameters:
        return <VotingParameters setOpen={setOpen} />;
      case ProposalCategory.ProposalAuthorization:
        return <ProposalAuthorization setOpen={setOpen} />;
      case ProposalCategory.UpgradeContract:
        return <UpgradeContract setOpen={setOpen} />;

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
            value={proposalCategory}
            exclusive
            onChange={handleChangeProposalType}
          >
            <ToggleButton
              value={ProposalCategory.Principles}
              disabled={
                !authorizations?.includes("addPrinciple") &&
                !authorizations?.includes("updatePrinciple") &&
                !authorizations?.includes("deletePrinciple")
              }
            >
              Carbon Credit Principles
            </ToggleButton>
            <ToggleButton
              value={ProposalCategory.Strategies}
              disabled={
                !authorizations?.includes("addStrategy") &&
                !authorizations?.includes("updateStrategy") &&
                !authorizations?.includes("deleteStrategy")
              }
            >
              Strategic Decisions
            </ToggleButton>
            <ToggleButton
              value={ProposalCategory.CouncilMembers}
              disabled={
                !authorizations?.includes("addMember") &&
                !authorizations?.includes("removeMember")
              }
            >
              Council Members
            </ToggleButton>
            <ToggleButton
              value={ProposalCategory.VotingParameters}
              disabled={
                !authorizations?.includes("updateQuorumNumerator") &&
                !authorizations?.includes("setVotingPeriod")
              }
            >
              Voting Parameters
            </ToggleButton>
            <ToggleButton
              value={ProposalCategory.ProposalAuthorization}
              disabled={
                !authorizations?.includes("addProposalAuthorization") &&
                !authorizations?.includes("removeProposalAuthorization")
              }
            >
              Proposal Authorization
            </ToggleButton>
            <ToggleButton
              value={ProposalCategory.UpgradeContract}
              disabled={!authorizations?.includes("upgradeTo")}
            >
              Upgrade Contract
            </ToggleButton>
          </ToggleButtonGroup>

          <ProposalComponent />
        </Stack>
      </Modal>
    </div>
  );
};

export default ProposeButton;
