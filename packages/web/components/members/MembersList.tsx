import {
  Divider,
  List,
  ListItem,
  ListSubheader,
  Stack,
  Typography,
} from "@mui/material";
import { ethers } from "ethers";
import useSWR from "swr";
import { Roles } from "~/@types/Roles";
import { useICVCMRoles } from "~/hooks/contracts";
import { getMembers } from "~/services/members";

type Props = {};

function MembersList({}: Props) {
  const ICVCMRoles = useICVCMRoles();
  const { data } = useSWR(ICVCMRoles ? "members" : null, async () =>
    getMembers(ICVCMRoles)
  );

  const directors = data?.filter((member) => member.role === Roles.Director);
  const experts = data?.filter((member) => member.role === Roles.Expert);
  const secretariat = data?.filter(
    (member) => member.role === Roles.Secretariat
  );

  return (
    <List>
      <ListSubheader>
        <Typography variant="h6">Directors</Typography>
      </ListSubheader>
      {directors?.map((member) => (
        <ListItem key={member.memberAddress}>
          <Stack>
            <Typography>
              {ethers.utils.parseBytes32String(member.name)}
            </Typography>
            <Typography variant="caption" color="GrayText">
              {member.memberAddress}
            </Typography>
          </Stack>
        </ListItem>
      ))}

      <Divider />

      <ListSubheader sx={{ marginTop: 1 }}>
        <Typography variant="h6">Expert Panel</Typography>
      </ListSubheader>
      {experts?.map((member) => (
        <ListItem key={member.memberAddress}>
          <Stack>
            <Typography>
              {ethers.utils.parseBytes32String(member.name)}
            </Typography>
            <Typography variant="caption" color="GrayText">
              {member.memberAddress}
            </Typography>
          </Stack>
        </ListItem>
      ))}

      <Divider />

      <ListSubheader sx={{ marginTop: 1 }}>
        <Typography variant="h6">Executive Secretariat</Typography>
      </ListSubheader>
      {secretariat?.map((member) => (
        <ListItem key={member.memberAddress}>
          <Stack>
            <Typography>
              {ethers.utils.parseBytes32String(member.name)}
            </Typography>
            <Typography variant="caption" color="GrayText">
              {member.memberAddress}
            </Typography>
          </Stack>
        </ListItem>
      ))}
    </List>
  );
}

export default MembersList;
