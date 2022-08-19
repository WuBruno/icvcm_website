import { RemoveCircleOutline } from "@mui/icons-material";
import AddCircleOutline from "@mui/icons-material/AddCircleOutline";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Tab } from "@mui/material";
import { useMemo, useState } from "react";
import useSWR from "swr";
import { useUser } from "~/hooks/common";
import { useICVCMRoles } from "~/hooks/contracts";
import { getProposalAuthorizations } from "~/services/members";
import AddMember from "./AddMember";
import RemoveMember from "./RemoveMember";

type Props = { setOpen: (open: boolean) => void };

const CouncilMembers = ({ setOpen }: Props) => {
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
              disabled={!authorizations?.includes("addMember")}
              icon={<AddCircleOutline />}
              iconPosition="start"
              label="Add Member"
              value="1"
            />
            <Tab
              disabled={!authorizations?.includes("removeMember")}
              icon={<RemoveCircleOutline />}
              iconPosition="start"
              label="Remove Member"
              value="2"
            />
          </TabList>
        </Box>
        <TabPanel value="1">
          <AddMember setOpen={setOpen} />
        </TabPanel>
        <TabPanel value="2">
          <RemoveMember setOpen={setOpen} />
        </TabPanel>
      </TabContext>
    </Box>
  );
};

export default CouncilMembers;
