import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
} from "@mui/material";
import useSWR from "swr";
import { Roles } from "~/@types/Roles";
import {
  useICVCMConstitution,
  useICVCMGovernor,
  useICVCMRoles,
} from "~/hooks/contracts";
import {
  getMemberHistory,
  getPrinciples,
  getPrinciplesHistory,
  getStrategies,
  getStrategiesHistory,
} from "~/services/constitution";
import { MembersList } from "../members";
import ConstitutionTimeline from "./ConstitutionTimeline";

type Props = {};

function ConstitutionInfo({}: Props) {
  const ICVCMConstitution = useICVCMConstitution();
  const ICVCMGovernor = useICVCMGovernor();
  const ICVCMRoles = useICVCMRoles();

  const { data: principles } = useSWR(
    ICVCMConstitution ? "principles" : null,
    async () => getPrinciples(ICVCMConstitution)
  );
  const { data: strategies } = useSWR(
    ICVCMConstitution ? "strategies" : null,
    async () => getStrategies(ICVCMConstitution)
  );
  const { data: principlesHistory } = useSWR("getPrinciplesHistory", async () =>
    getPrinciplesHistory(ICVCMGovernor, ICVCMRoles, ICVCMConstitution)
  );
  const { data: strategiesHistory } = useSWR("getStrategiesHistory", async () =>
    getStrategiesHistory(ICVCMGovernor, ICVCMRoles, ICVCMConstitution)
  );
  const { data: memberHistory } = useSWR("getMemberHistory", async () =>
    getMemberHistory(ICVCMGovernor, ICVCMRoles)
  );

  return (
    <Box>
      <Typography variant="h5">Constitution</Typography>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Carbon Credit Principles</Typography>
        </AccordionSummary>

        <AccordionDetails>
          <Typography variant="h6">Current CCPs</Typography>
          <Typography gutterBottom>{principles}</Typography>

          <Typography variant="h6">CCPs History</Typography>
          <ConstitutionTimeline
            items={principlesHistory}
            keyExtractor={(item) => item.proposal.proposalId}
            leftText={(item) => item.time.toLocaleString()}
            rightHeading={(item) => item.proposal.description}
            rightText={(item) => item.value}
          />
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Strategic Decisions</Typography>
        </AccordionSummary>

        <AccordionDetails>
          <Typography variant="h6">Current Strategies</Typography>
          <Typography gutterBottom>{strategies}</Typography>

          <Typography variant="h6">Strategies History</Typography>
          <ConstitutionTimeline
            items={strategiesHistory}
            keyExtractor={(item) => item.proposal.proposalId}
            leftText={(item) => item.time.toLocaleString()}
            rightHeading={(item) => item.proposal.description}
            rightText={(item) => item.value}
          />
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Members</Typography>
        </AccordionSummary>

        <AccordionDetails>
          <MembersList />

          <Typography variant="h6">Membership Changes</Typography>
          <ConstitutionTimeline
            items={memberHistory}
            keyExtractor={(item) =>
              item.member.memberAddress + item.proposal?.proposalId
            }
            leftText={(item) => item.time.toLocaleString()}
            rightHeading={(item) =>
              item.proposal?.description || "Council Creation"
            }
            rightText={(item) =>
              `${item.operation} ${item.member.name} as ${
                Roles[item.member.role]
              }`
            }
            dotColor={(item) =>
              item.operation === "add" ? "success" : "error"
            }
          />
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}

export default ConstitutionInfo;
