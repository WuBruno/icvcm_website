import ICVCM_GOVERNOR_CONTRACT_ABI from "~/contracts/ICVCMGovernor.json";
import type { ICVCMGovernor } from "~/contracts/types";
import ContractAddress from "~/contract.json";

import { useContract } from "~/hooks";

export default function useICVCMGovernor() {
  return useContract<ICVCMGovernor>(
    ContractAddress.ICVCMGovernor,
    ICVCM_GOVERNOR_CONTRACT_ABI
  );
}
