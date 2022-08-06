import { ethers } from "ethers";
import { mutate } from "swr";
import { Proposal, ProposalAction, ProposalState } from "~/@types";
import { Roles } from "~/@types/Roles";
import ContractAddresses from "~/contract.json";
import {
  ICVCMConstitution,
  ICVCMConstitution__factory,
  ICVCMGovernor,
  ICVCMRoles,
  ICVCMToken,
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

      const contractAddress = args.targets[0];
      const calldata = args.calldatas[0];
      const methodId = calldata.slice(0, 10);

      let proposalAction: ProposalAction;

      if (contractAddress === ContractAddresses.ICVCMRoles) {
        // They are role changes
        const ICVCMRolesInterface = ICVCMRoles.interface;
        const fragment = ICVCMRolesInterface.getFunction(methodId);
        switch (fragment) {
          case ICVCMRolesInterface.functions[
            "addMember(address,uint8,bytes32)"
          ]:
            var [address, role, name] = ICVCMRolesInterface.decodeFunctionData(
              fragment,
              calldata
            );
            proposalAction = {
              action: "addMember",
              payload: {
                member: {
                  memberAddress: address,
                  role,
                  name: ethers.utils.parseBytes32String(name),
                },
              },
            };
            break;

          case ICVCMRolesInterface.functions["removeMember(address)"]:
            var [address] = ICVCMRolesInterface.decodeFunctionData(
              fragment,
              calldata
            );
            proposalAction = {
              action: "removeMember",
              payload: {
                member: await getMember(ICVCMRoles, address),
              },
            };
            break;
        }
      } else if (contractAddress === ContractAddresses.ICVCMConstitution) {
        // They are constitution changes
        const ICVCMConstitutionInterface =
          ICVCMConstitution__factory.createInterface();
        const fragment = ICVCMConstitutionInterface.getFunction(methodId);

        switch (fragment) {
          case ICVCMConstitutionInterface.functions["setPrinciples(string)"]:
            var [principles] = ICVCMConstitutionInterface.decodeFunctionData(
              fragment,
              calldata
            );
            proposalAction = {
              action: "editPrinciples",
              payload: { principles },
            };
            break;
          case ICVCMConstitutionInterface.functions["setStrategies(string)"]:
            var [strategies] = ICVCMConstitutionInterface.decodeFunctionData(
              fragment,
              calldata
            );
            proposalAction = {
              action: "editStrategies",
              payload: { strategies },
            };
            break;
        }
      }

      return {
        proposalId: proposalId,
        description: args.description,
        state: await getProposalState(ICVCMGovernor, proposalId),
        targets: args.targets,
        calldatas: args.calldatas,
        proposer: await getMember(ICVCMRoles, args.proposer),
        time: new Date(block.timestamp * 1e3),
        proposalAction,
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
  await mutate(["getTotalVotesRequired", proposal.proposalId]);
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

export const getTotalVotesRequired = async (
  ICVCMGovernor: ICVCMGovernor,
  ICVCMToken: ICVCMToken,
  proposalId: string
) => {
  const blockNumber = await ICVCMGovernor.proposalSnapshot(proposalId);
  return ICVCMToken.getPastTotalSupply(blockNumber);
};
