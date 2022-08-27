import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import useSWR from "swr";
import { Roles } from "~/@types/Roles";
import { MembersList } from "~/components/members";
import {
  useICVCMConstitution,
  useICVCMGovernor,
  useICVCMRoles,
  useICVCMToken,
} from "~/hooks/contracts";
import {
  getMemberHistory,
  getPrinciples,
  getPrinciplesHistory,
  getSettingsHistory,
  getStrategies,
  getStrategiesHistory,
} from "~/services/constitution";
import { getQuorum, getVotingPeriod } from "~/services/proposals";
import { parseBlockToDays, parseDaysToBlocks } from "~/util";
import ConstitutionTimeline from "./ConstitutionTimeline";
import ContractInfo from "./ContractInfo";
import ProposalAuthorizationList from "./ProposalAuthorizationList";

type Props = {};

function ConstitutionInfo({}: Props) {
  const ICVCMConstitution = useICVCMConstitution();
  const ICVCMGovernor = useICVCMGovernor();
  const ICVCMRoles = useICVCMRoles();
  const ICVCMToken = useICVCMToken();

  const { data: principles } = useSWR(
    ICVCMConstitution ? "getPrinciples" : null,
    async () => getPrinciples(ICVCMConstitution)
  );

  const { data: strategies } = useSWR(
    ICVCMConstitution ? "getStrategies" : null,
    async () => getStrategies(ICVCMConstitution)
  );
  const { data: principlesHistory } = useSWR(
    ICVCMGovernor && ICVCMRoles && ICVCMConstitution
      ? "getPrinciplesHistory"
      : null,
    async () =>
      getPrinciplesHistory(ICVCMGovernor, ICVCMRoles, ICVCMConstitution)
  );
  const { data: strategiesHistory } = useSWR(
    ICVCMGovernor && ICVCMRoles && ICVCMConstitution
      ? "getStrategiesHistory"
      : null,
    async () =>
      getStrategiesHistory(ICVCMGovernor, ICVCMRoles, ICVCMConstitution)
  );
  const { data: memberHistory } = useSWR(
    ICVCMGovernor && ICVCMRoles ? "getMemberHistory" : null,
    async () => getMemberHistory(ICVCMGovernor, ICVCMRoles)
  );
  const { data: quorum } = useSWR(
    ICVCMGovernor ? "getQuorum" : null,
    async () => getQuorum(ICVCMGovernor)
  );
  const { data: period } = useSWR(
    ICVCMGovernor ? "getVotingPeriod" : null,
    async () => getVotingPeriod(ICVCMGovernor)
  );

  const { data: settingsHistory } = useSWR(
    ICVCMGovernor && ICVCMRoles && ICVCMConstitution && ICVCMToken
      ? "getSettingsHistory"
      : null,
    async () =>
      getSettingsHistory(
        ICVCMGovernor,
        ICVCMRoles,
        ICVCMConstitution,
        ICVCMToken
      )
  );

  return (
    <Box>
      <Typography variant="h5">Constitution</Typography>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Carbon Credit Principles</Typography>
        </AccordionSummary>

        <AccordionDetails>
          <Typography variant="h5">Current CCPs</Typography>
          <TableContainer component={Paper} sx={{ mb: 2 }}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell width={1}>ID</TableCell>
                  <TableCell>CCP</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {principles &&
                  principles.map(({ id, value }) => (
                    <TableRow
                      key={id.toString()}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell>{id.toString()}</TableCell>
                      <TableCell>{value}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Typography variant="h5">CCPs History</Typography>
          <ConstitutionTimeline
            items={principlesHistory}
            keyExtractor={(item) => item.proposal?.proposalId || item.value}
            leftText={(item) => item.time.toLocaleString()}
            rightHeading={(item) =>
              item.proposal?.description || "Council Creation"
            }
            dotColor={(item) => {
              switch (item.operation) {
                case "add":
                  return "success";
                case "update":
                  return "info";
                case "remove":
                  return "error";
                default:
                  return "warning";
              }
            }}
            rightText={(item) => item.value}
          />
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Strategic Decisions</Typography>
        </AccordionSummary>

        <AccordionDetails>
          <Typography variant="h5">Current Strategies</Typography>
          <TableContainer component={Paper} sx={{ mb: 2 }}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell width={1}>ID</TableCell>
                  <TableCell>Strategy</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {strategies &&
                  strategies.map(({ id, value }) => (
                    <TableRow
                      key={id.toString()}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell>{id.toString()}</TableCell>
                      <TableCell>{value}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Typography variant="h5">Strategies History</Typography>
          <ConstitutionTimeline
            items={strategiesHistory}
            keyExtractor={(item) => item.proposal?.proposalId || item.value}
            leftText={(item) => item.time.toLocaleString()}
            rightHeading={(item) =>
              item.proposal?.description || "Council Creation"
            }
            dotColor={(item) => {
              switch (item.operation) {
                case "add":
                  return "success";
                case "update":
                  return "info";
                case "remove":
                  return "error";
                default:
                  return "warning";
              }
            }}
            rightText={(item) => item.value}
          />
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Members</Typography>
        </AccordionSummary>

        <AccordionDetails>
          <Typography variant="h5">Current Members</Typography>
          <MembersList />

          <Typography variant="h5">Membership Changes</Typography>
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

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Settings</Typography>
        </AccordionSummary>

        <AccordionDetails>
          <Typography variant="h5">Current Governance Settings</Typography>
          <Typography gutterBottom>
            Voting Quorum: {quorum && quorum.toNumber()}%
          </Typography>
          <Typography gutterBottom>
            Voting Period: {period} days ≈ {parseDaysToBlocks(period)} Blocks{" "}
          </Typography>
          <Typography variant="h6">Proposal Authorizations:</Typography>
          <ProposalAuthorizationList />
          <ContractInfo />

          <Typography variant="h5" sx={{ mt: 2 }}>
            Setting Changes
          </Typography>
          <ConstitutionTimeline
            items={settingsHistory}
            keyExtractor={(item) =>
              item.proposal?.proposalId ?? item.value + item.type
            }
            leftText={(item) => item.time.toLocaleString()}
            rightHeading={(item) =>
              item.proposal?.description || "Council Creation"
            }
            dotColor={(item) => {
              switch (item.operation) {
                case "addProposalAuthorization":
                  return "success";
                case "upgrade":
                  return "info";
                case "removeProposalAuthorization":
                  return "error";
                default:
                  return "warning";
              }
            }}
            rightText={(item) => {
              switch (item.operation) {
                case "quorum":
                  return `Set quorum to ${item.value}`;
                case "period":
                  return `Set voting period to ${parseBlockToDays(
                    Number(item.value)
                  )} Days ≈ ${item.value} Blocks`;
                default:
                  return item.value;
              }
            }}
          />
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}

export default ConstitutionInfo;
