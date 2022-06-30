import ICVCM_GOVERNOR_CONTRACT_ABI from "../contracts/ICVCMGovernor.json";
import type { ICVCMGovernor, ICVCMToken } from "../contracts/types";
import ContractAddress from "../contract.json";

import useContract from "./useContract";

export type Proposal = {
  proposalId: string;
  description: string;
};

export const propose = async (
  ICVCMGovernor: ICVCMGovernor,
  ICVCMToken: ICVCMToken,
  targetAddress: string,
  description: string
) => {
  const encodedFunctionCall = ICVCMToken.interface.encodeFunctionData(
    "safeMint",
    [targetAddress]
  );

  const proposalTx = await ICVCMGovernor.propose(
    [ICVCMToken.address],
    [0],
    [encodedFunctionCall],
    description
  );

  const proposeReceipt = await proposalTx.wait(1);
  const proposalId = proposeReceipt.events![0].args!.proposalId;

  return proposalId;
};

export const getProposalState = async (
  ICVCMGovernor: ICVCMGovernor,
  proposalId: string
) => ICVCMGovernor.state(proposalId);

export const proposalEvents = async (
  ICVCMGovernor: ICVCMGovernor
): Promise<Proposal[]> => {
  const filter = ICVCMGovernor.filters.ProposalCreated();
  const proposals = await ICVCMGovernor.queryFilter(filter);

  return proposals.map(({ args }) => ({
    proposalId: args[0].toString(),
    description: args[8],
  }));
};

export default function useICVCMGovernor() {
  return useContract<ICVCMGovernor>(
    ContractAddress.ICVCMGovernor,
    ICVCM_GOVERNOR_CONTRACT_ABI
  );
}
