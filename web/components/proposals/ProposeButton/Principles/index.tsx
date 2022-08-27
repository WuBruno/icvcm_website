import { ChangeCircleOutlined, RemoveCircleOutline } from "@mui/icons-material";
import AddCircleOutline from "@mui/icons-material/AddCircleOutline";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Tab } from "@mui/material";
import { useMemo, useState } from "react";
import useSWR from "swr";
import { useUser } from "~/hooks/common";
import { useICVCMRoles } from "~/hooks/contracts";
import { getProposalAuthorizations } from "~/services/members";
import AddPrinciple from "./AddPrinciple";
import RemovePrinciple from "./RemovePrinciple";
import UpdatePrinciple from "./UpdatePrinciple";

type Props = { setOpen: (open: boolean) => void };

const Principles = ({ setOpen }: Props) => {
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
              disabled={!authorizations?.includes("addPrinciple")}
              icon={<AddCircleOutline />}
              iconPosition="start"
              label="Add CCP"
              value="1"
            />
            <Tab
              disabled={!authorizations?.includes("updatePrinciple")}
              icon={<ChangeCircleOutlined />}
              iconPosition="start"
              label="Update CCP"
              value="2"
            />
            <Tab
              disabled={!authorizations?.includes("removePrinciple")}
              icon={<RemoveCircleOutline />}
              iconPosition="start"
              label="Remove CCP"
              value="3"
            />
          </TabList>
        </Box>
        <TabPanel value="1">
          <AddPrinciple setOpen={setOpen} />
        </TabPanel>
        <TabPanel value="2">
          <UpdatePrinciple setOpen={setOpen} />
        </TabPanel>
        <TabPanel value="3">
          <RemovePrinciple setOpen={setOpen} />
        </TabPanel>
      </TabContext>
    </Box>
  );
};

export default Principles;
