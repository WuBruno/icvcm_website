import ICVCM_GOVERNOR_CONTRACT_ABI from "~/contracts/ICVCMGovernor.json";
import type { ICVCMGovernor, ICVCMToken } from "~/contracts/types";
import ContractAddress from "~/contract.json";

import { useContract } from "~/hooks";
import { Proposal, ProposalState } from "~/@types";

export default function useICVCMGovernor() {
  const ICVCMGovernor = useContract<ICVCMGovernor>(
    ContractAddress.ICVCMGovernor,
    ICVCM_GOVERNOR_CONTRACT_ABI
  );

  const getProposals = async (): Promise<Proposal[]> => {
    const filter = ICVCMGovernor.filters.ProposalCreated();
    const proposals = await ICVCMGovernor.queryFilter(filter);

    return Promise.all(
      proposals.map(async ({ args }) => {
        const proposalId = args[0].toString();
        return {
          proposalId: proposalId,
          description: args[8],
          state: await getProposalState(proposalId),
        };
      })
    );
  };

  const getProposalState = async (proposalId: string): Promise<ProposalState> =>
    ICVCMGovernor.state(proposalId);

  const propose = async (
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

  return { ICVCMGovernor, propose, getProposals, getProposalState };
}
