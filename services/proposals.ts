import { ethers } from "ethers";
import { mutate } from "swr";
import { Proposal, ProposalState } from "~/@types";
import {
  ICVCMConstitution,
  ICVCMGovernor,
  ICVCMToken,
} from "~/contracts/types";

export const propose = async (
  ICVCMGovernor: ICVCMGovernor,
  contractAddress: string,
  encodedFunctionCall: string,
  description: string
): Promise<string> => {
  const proposalTx = await ICVCMGovernor.propose(
    [contractAddress],
    [0],
    [encodedFunctionCall],
    description
  );

  // Wait for 1 block confirmation for successful txn
  const proposeReceipt = await proposalTx.wait();
  const proposalId = proposeReceipt.events![0].args!.proposalId;

  await mutate("getProposals");

  return proposalId;
};

export const proposePrinciple = async (
  ICVCMGovernor: ICVCMGovernor,
  ICVCMConstitution: ICVCMConstitution,
  newPrinciples: string,
  description: string
) => {
  console.log(newPrinciples, description);

  const encodedFunctionCall = ICVCMConstitution.interface.encodeFunctionData(
    "setPrinciples",
    [newPrinciples]
  );

  return propose(
    ICVCMGovernor,
    ICVCMConstitution.address,
    encodedFunctionCall,
    description
  );
};

export const getProposals = async (
  ICVCMGovernor: ICVCMGovernor
): Promise<Proposal[]> => {
  const filter = ICVCMGovernor.filters.ProposalCreated();
  const proposals = await ICVCMGovernor.queryFilter(filter);

  return Promise.all(
    proposals.map(async ({ args }) => {
      const proposalId = args.proposalId.toString();
      return {
        proposalId: proposalId,
        description: args.description,
        state: await getProposalState(ICVCMGovernor, proposalId),
        targets: args.targets,
        calldatas: args.calldatas,
      };
    })
  );
};

export const getProposalState = async (
  ICVCMGovernor: ICVCMGovernor,
  proposalId: string
): Promise<ProposalState> => ICVCMGovernor.state(proposalId);

export const executeProposal = async (
  ICVCMGovernor: ICVCMGovernor,
  proposal: Proposal
) => {
  console.log(proposal.targets, proposal.calldatas);

  const tx = await ICVCMGovernor.execute(
    proposal.targets,
    [0],
    proposal.calldatas,
    ethers.utils.id(proposal.description)
  );
  await tx.wait();

  await mutate("getProposals");
};
