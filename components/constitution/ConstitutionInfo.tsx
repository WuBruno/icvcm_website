import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
} from "@mui/material";
import useSWR from "swr";
import { useICVCMConstitution } from "~/hooks";
import { getPrinciples, getStrategies } from "~/services/constitution";
import { MembersList } from "../members";

type Props = {};

function ConstitutionInfo({}: Props) {
  const ICVCMConstitution = useICVCMConstitution();
  const { data: principles } = useSWR(
    ICVCMConstitution ? "principles" : null,
    async () => getPrinciples(ICVCMConstitution)
  );
  const { data: strategies } = useSWR(
    ICVCMConstitution ? "strategies" : null,
    async () => getStrategies(ICVCMConstitution)
  );

  return (
    <Box>
      <Typography variant="h5">Constitution</Typography>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography paragraph>Carbon Credit Principles</Typography>
        </AccordionSummary>

        <AccordionDetails>
          <Typography>{principles}</Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Strategic Decisions</Typography>
        </AccordionSummary>

        <AccordionDetails>
          <Typography>{strategies}</Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Members</Typography>
        </AccordionSummary>

        <AccordionDetails>
          <MembersList />
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}

export default ConstitutionInfo;
