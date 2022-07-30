import { parseBytes32String } from "ethers/lib/utils";
import { Member } from "~/@types/Roles";
import { ICVCMRoles } from "~/contracts/types";

export const getMember = async (
  ICVCMRoles: ICVCMRoles,
  memberAddress: string
): Promise<Member | undefined> => {
  try {
    const member = await ICVCMRoles.getMember(memberAddress);
    return {
      ...member,
      name: parseBytes32String(member.name),
      memberAddress,
    };
  } catch (errors) {}
};

export const getMembers = async (ICVCMRoles: ICVCMRoles): Promise<Member[]> =>
  ICVCMRoles.getMembers();
