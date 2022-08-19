import { AlarmOnOutlined, BalanceOutlined } from "@mui/icons-material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Tab } from "@mui/material";
import { useMemo, useState } from "react";
import useSWR from "swr";
import { useUser } from "~/hooks/common";
import { useICVCMRoles } from "~/hooks/contracts";
import { getProposalAuthorizations } from "~/services/members";
import VotingPeriod from "./VotingPeriod";
import VotingQuorum from "./VotingQuorum";

type Props = { setOpen: (open: boolean) => void };

const VotingParameters = ({ setOpen }: Props) => {
  const { user } = useUser();
  const ICVCMRoles = useICVCMRoles();
  const { data } = useSWR(
    ICVCMRoles ? "getProposalAuthorizations" : null,
    async () => getProposalAuthorizations(ICVCMRoles)
  );

  const authorizations = useMemo(() => {
    if (user && data) {
      return data.filter((p) => p.role == user.role).map((p) => p.function);
    }
    return;
  }, [user, data]);

  const [value, setValue] = useState("1");

  const handleChange = (_, newValue: string) => {
    setValue(newValue);
  };
  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab
              disabled={!authorizations?.includes("updateQuorumNumerator")}
              icon={<BalanceOutlined />}
              iconPosition="start"
              label="Voting Quorum"
              value="1"
            />
            <Tab
              disabled={!authorizations?.includes("setVotingPeriod")}
              icon={<AlarmOnOutlined />}
              iconPosition="start"
              label="Voting Period"
              value="2"
            />
          </TabList>
        </Box>
        <TabPanel value="1">
          <VotingQuorum setOpen={setOpen} />
        </TabPanel>
        <TabPanel value="2">
          <VotingPeriod setOpen={setOpen} />
        </TabPanel>
      </TabContext>
    </Box>
  );
};

export default VotingParameters;
