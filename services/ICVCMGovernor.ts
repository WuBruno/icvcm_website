import { Proposal, ProposalState } from "~/@types";
import { ICVCMGovernor, ICVCMToken } from "~/contracts/types";

export const propose = async (
  ICVCMGovernor: ICVCMGovernor,
  ICVCMToken: ICVCMToken,
  targetAddress: string,
  description: string
): Promise<string> => {
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

  // Wait for 1 block confirmation for successful txn
  const proposeReceipt = await proposalTx.wait(1);
  const proposalId = proposeReceipt.events![0].args!.proposalId;

  return proposalId;
};

export const getProposals = async (
  ICVCMGovernor: ICVCMGovernor
): Promise<Proposal[]> => {
  const filter = ICVCMGovernor.filters.ProposalCreated();
  const proposals = await ICVCMGovernor.queryFilter(filter);

  return Promise.all(
    proposals.map(async ({ args }) => {
      const proposalId = args[0].toString();
      return {
        proposalId: proposalId,
        description: args[8],
        state: await getProposalState(ICVCMGovernor, proposalId),
      };
    })
  );
};

export const getProposalState = async (
  ICVCMGovernor: ICVCMGovernor,
  proposalId: string
): Promise<ProposalState> => ICVCMGovernor.state(proposalId);
