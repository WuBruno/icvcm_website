import { useWeb3React } from "@web3-react/core";
import useSWR from "swr";
import { Member } from "~/@types/Roles";
import { getMember } from "~/services/members";
import { useICVCMRoles } from "../contracts";

const useUser = (): { user?: Member } => {
  const ICVCMRoles = useICVCMRoles();
  const { account } = useWeb3React();

  const { data: user } = useSWR(account ? "member" : null, async () =>
    getMember(ICVCMRoles, account)
  );

  return { user };
};

export default useUser;
