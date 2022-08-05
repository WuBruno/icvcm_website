import { ethers } from "ethers";
import { mutate } from "swr";
import { Proposal, ProposalState } from "~/@types";
import { Roles } from "~/@types/Roles";
import {
  ICVCMConstitution,
  ICVCMGovernor,
  ICVCMRoles,
} from "~/contracts/types";
import { getMember } from "./members";

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

export const proposeStrategy = async (
  ICVCMGovernor: ICVCMGovernor,
  ICVCMConstitution: ICVCMConstitution,
  newStrategies: string,
  description: string
) => {
  const encodedFunctionCall = ICVCMConstitution.interface.encodeFunctionData(
    "setStrategies",
    [newStrategies]
  );

  return propose(
    ICVCMGovernor,
    ICVCMConstitution.address,
    encodedFunctionCall,
    description
  );
};

export const proposeAddMember = async (
  ICVCMGovernor: ICVCMGovernor,
  ICVCMRoles: ICVCMRoles,
  description: string,
  name: string,
  role: Roles,
  address: string
) => {
  const encodedFunctionCall = ICVCMRoles.interface.encodeFunctionData(
    "addMember",
    [address, role, ethers.utils.formatBytes32String(name)]
  );

  return propose(
    ICVCMGovernor,
    ICVCMRoles.address,
    encodedFunctionCall,
    description
  );
};

export const proposeRemoveMember = async (
  ICVCMGovernor: ICVCMGovernor,
  ICVCMRoles: ICVCMRoles,
  description: string,
  address: string
) => {
  const encodedFunctionCall = ICVCMRoles.interface.encodeFunctionData(
    "removeMember",
    [address]
  );

  return propose(
    ICVCMGovernor,
    ICVCMRoles.address,
    encodedFunctionCall,
    description
  );
};

export const getProposals = async (
  ICVCMGovernor: ICVCMGovernor,
  ICVCMRoles: ICVCMRoles
): Promise<Proposal[]> => {
  const filter = ICVCMGovernor.filters.ProposalCreated();
  const proposals = await ICVCMGovernor.queryFilter(filter);

  return Promise.all(
    proposals.map(async ({ args, getBlock }) => {
      const proposalId = args.proposalId.toString();
      const block = await getBlock();

      return {
        proposalId: proposalId,
        description: args.description,
        state: await getProposalState(ICVCMGovernor, proposalId),
        targets: args.targets,
        calldatas: args.calldatas,
        proposer: await getMember(ICVCMRoles, args.proposer),
        time: new Date(block.timestamp * 1e3),
      };
    })
  );
};

export const getProposalState = async (
  ICVCMGovernor: ICVCMGovernor,
  proposalId: string
): Promise<ProposalState> => ICVCMGovernor.state(proposalId);

export const getProposalExecutionEvent = async (
  ICVCMGovernor: ICVCMGovernor,
  proposalId: string
) => {
  const filter = ICVCMGovernor.filters.ProposalExecuted(
    ethers.BigNumber.from(proposalId)
  );
  const result = await ICVCMGovernor.queryFilter(filter);

  if (result.length === 0) {
    return;
  }
  const block = await result[0].getBlock();

  return new Date(block.timestamp * 1e3);
};

export const getProposalCancelEvent = async (
  ICVCMGovernor: ICVCMGovernor,
  proposalId: string
) => {
  const filter = ICVCMGovernor.filters.ProposalCanceled(
    ethers.BigNumber.from(proposalId)
  );
  const result = await ICVCMGovernor.queryFilter(filter);

  if (result.length === 0) {
    return;
  }
  const block = await result[0].getBlock();

  return new Date(block.timestamp * 1e3);
};

export const executeProposal = async (
  ICVCMGovernor: ICVCMGovernor,
  proposal: Proposal
) => {
  const tx = await ICVCMGovernor.execute(
    proposal.targets,
    [0],
    proposal.calldatas,
    ethers.utils.id(proposal.description)
  );
  await tx.wait();

  await mutate("getProposals");
  await mutate(["getProposalExecutionEvent", proposal.proposalId]);
};

export const cancelProposal = async (
  ICVCMGovernor: ICVCMGovernor,
  proposal: Proposal
) => {
  const tx = await ICVCMGovernor.cancel(
    proposal.targets,
    [0],
    proposal.calldatas,
    ethers.utils.id(proposal.description)
  );
  await tx.wait();

  await mutate("getProposals");
  await mutate(["getProposalCancelEvent", proposal.proposalId]);
};
