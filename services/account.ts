import { ICVCMRoles } from "~/contracts/types";

export const getMember = async (
  ICVCMRoles: ICVCMRoles,
  memberAddress: string
) => {
  return ICVCMRoles.getMember(memberAddress);
};
