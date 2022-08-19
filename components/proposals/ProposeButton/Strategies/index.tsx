import { ChangeCircleOutlined, RemoveCircleOutline } from "@mui/icons-material";
import AddCircleOutline from "@mui/icons-material/AddCircleOutline";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Tab } from "@mui/material";
import { useMemo, useState } from "react";
import useSWR from "swr";
import { useUser } from "~/hooks/common";
import { useICVCMRoles } from "~/hooks/contracts";
import { getProposalAuthorizations } from "~/services/members";
import AddStrategy from "./AddStrategy";
import RemoveStrategy from "./RemoveStrategy";
import UpdateStrategy from "./UpdateStrategy";

type Props = { setOpen: (open: boolean) => void };

const Strategies = ({ setOpen }: Props) => {
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
              disabled={!authorizations?.includes("addStrategy")}
              icon={<AddCircleOutline />}
              iconPosition="start"
              label="Add Strategy"
              value="1"
            />
            <Tab
              disabled={!authorizations?.includes("updateStrategy")}
              icon={<ChangeCircleOutlined />}
              iconPosition="start"
              label="Update Strategy"
              value="2"
            />
            <Tab
              disabled={!authorizations?.includes("removeStrategy")}
              icon={<RemoveCircleOutline />}
              iconPosition="start"
              label="Remove Strategy"
              value="3"
            />
          </TabList>
        </Box>
        <TabPanel value="1">
          <AddStrategy setOpen={setOpen} />
        </TabPanel>
        <TabPanel value="2">
          <UpdateStrategy setOpen={setOpen} />
        </TabPanel>
        <TabPanel value="3">
          <RemoveStrategy setOpen={setOpen} />
        </TabPanel>
      </TabContext>
    </Box>
  );
};

export default Strategies;
