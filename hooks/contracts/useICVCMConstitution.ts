import ContractAddress from "~/contract.json";
import ICVCM_CONSTITUTION_CONTRACT_ABI from "~/contracts/ICVCMConstitution.json";
import type { ICVCMConstitution } from "~/contracts/types";

import { useContract } from "~/hooks/contracts";

export default function useICVCMConstitution() {
  return useContract<ICVCMConstitution>(
    ContractAddress.ICVCMConstitution,
    ICVCM_CONSTITUTION_CONTRACT_ABI
  );
}
