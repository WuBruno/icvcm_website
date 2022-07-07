import ICVCM_Roles_CONTRACT_ABI from "~/contracts/ICVCMRoles.json";
import type { ICVCMRoles } from "~/contracts/types";
import ContractAddress from "~/contract.json";

import { useContract } from "~/hooks";

export default function useICVCMGovernor() {
  return useContract<ICVCMRoles>(
    ContractAddress.ICVCMRoles,
    ICVCM_Roles_CONTRACT_ABI
  );
}
