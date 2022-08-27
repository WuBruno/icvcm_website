import { Stack, Typography } from "@mui/material";
import { Roles } from "~/@types/Roles";
import { useUser } from "~/hooks/common";

type Props = {};

const AccountInfo = (props: Props) => {
  const { user } = useUser();

  if (!user) {
    return null;
  }

  return (
    <Stack sx={{ marginY: 2 }}>
      <Typography>
        <Typography fontWeight="bold">Name:</Typography> {user.name}
      </Typography>
      <Typography>
        <Typography fontWeight="bold">Role:</Typography> {Roles[user.role]}
      </Typography>
    </Stack>
  );
};

export default AccountInfo;
