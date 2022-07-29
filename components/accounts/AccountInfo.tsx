import { Stack, Typography } from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import useSWR from "swr";
import { Roles } from "~/@types/Roles";
import { useICVCMRoles } from "~/hooks";
import { getMember } from "~/services/members";

type Props = {};

const AccountInfo = (props: Props) => {
  const ICVCMRoles = useICVCMRoles();
  const { account } = useWeb3React();

  const { data } = useSWR(account ? "member" : null, async () =>
    getMember(ICVCMRoles, account)
  );

  if (!data) {
    return null;
  }

  return (
    <Stack sx={{ marginY: 2 }}>
      <Typography>
        <Typography fontWeight="bold">Name:</Typography> {data.name}
      </Typography>
      <Typography>
        <Typography fontWeight="bold">Role:</Typography> {Roles[data.role]}
      </Typography>
    </Stack>
  );
};

export default AccountInfo;
