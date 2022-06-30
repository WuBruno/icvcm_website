import ICVCM_TOKEN_ARTIFACTS from "~/contracts/ICVCMToken.json";
import type { ICVCMToken } from "~/contracts/types";
import ContractAddress from "~/contract.json";

import useContract from "./useContract";

export default function useICVCMToken() {
  return useContract<ICVCMToken>(
    ContractAddress.ICVCMToken,
    ICVCM_TOKEN_ARTIFACTS
  );
}
