import { BigNumberish, ethers } from "ethers";
import { mutate } from "swr";
import { Proposal, ProposalAction, ProposalState } from "~/@types";
import { Contracts, ProposalAuthorization, Roles } from "~/@types/Roles";
import ContractAddresses from "~/contract.json";
import {
  ICVCMConstitution,
  ICVCMConstitution__factory,
  ICVCMGovernor,
  ICVCMGovernor__factory,
  ICVCMRoles,
  ICVCMRoles__factory,
  ICVCMToken,
  ICVCMToken__factory,
} from "~/contracts/types";
import { ProposalCreatedEvent } from "~/contracts/types/Governor";
import { parseBlockToDays } from "~/util";
import { getMember, parseProposalAuthorization } from "./members";

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

export const proposeAddPrinciple = async (
  ICVCMGovernor: ICVCMGovernor,
  ICVCMConstitution: ICVCMConstitution,
  description: string,
  newPrinciples: string
) => {
  const encodedFunctionCall = ICVCMConstitution.interface.encodeFunctionData(
    "addPrinciple",
    [newPrinciples]
  );

  return propose(
    ICVCMGovernor,
    ICVCMConstitution.address,
    encodedFunctionCall,
    description
  );
};

export const proposeUpdatePrinciple = async (
  ICVCMGovernor: ICVCMGovernor,
  ICVCMConstitution: ICVCMConstitution,
  description: string,
  proposalId: number,
  newPrinciples: string
) => {
  const encodedFunctionCall = ICVCMConstitution.interface.encodeFunctionData(
    "updatePrinciple",
    [proposalId, newPrinciples]
  );

  return propose(
    ICVCMGovernor,
    ICVCMConstitution.address,
    encodedFunctionCall,
    description
  );
};

export const proposeRemovePrinciple = async (
  ICVCMGovernor: ICVCMGovernor,
  ICVCMConstitution: ICVCMConstitution,
  description: string,
  principleId: number
) => {
  const encodedFunctionCall = ICVCMConstitution.interface.encodeFunctionData(
    "removePrinciple",
    [principleId]
  );

  return propose(
    ICVCMGovernor,
    ICVCMConstitution.address,
    encodedFunctionCall,
    description
  );
};

export const proposeAddStrategy = async (
  ICVCMGovernor: ICVCMGovernor,
  ICVCMConstitution: ICVCMConstitution,
  description: string,
  newStrategy: string
) => {
  const encodedFunctionCall = ICVCMConstitution.interface.encodeFunctionData(
    "addStrategy",
    [newStrategy]
  );

  return propose(
    ICVCMGovernor,
    ICVCMConstitution.address,
    encodedFunctionCall,
    description
  );
};

export const proposeUpdateStrategy = async (
  ICVCMGovernor: ICVCMGovernor,
  ICVCMConstitution: ICVCMConstitution,
  description: string,
  strategyId: number,
  newStrategy: string
) => {
  const encodedFunctionCall = ICVCMConstitution.interface.encodeFunctionData(
    "updateStrategy",
    [strategyId, newStrategy]
  );

  return propose(
    ICVCMGovernor,
    ICVCMConstitution.address,
    encodedFunctionCall,
    description
  );
};

export const proposeRemoveStrategy = async (
  ICVCMGovernor: ICVCMGovernor,
  ICVCMConstitution: ICVCMConstitution,
  description: string,
  strategyId: number
) => {
  const encodedFunctionCall = ICVCMConstitution.interface.encodeFunctionData(
    "removeStrategy",
    [strategyId]
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

export const proposeVotingQuorum = async (
  ICVCMGovernor: ICVCMGovernor,
  description: string,
  quorum: number
) => {
  const encodedFunctionCall = ICVCMGovernor.interface.encodeFunctionData(
    "updateQuorumNumerator",
    [ethers.BigNumber.from(quorum)]
  );

  return propose(
    ICVCMGovernor,
    ICVCMGovernor.address,
    encodedFunctionCall,
    description
  );
};

export const proposeVotingPeriod = async (
  ICVCMGovernor: ICVCMGovernor,
  description: string,
  votingPeriod: number
) => {
  const encodedFunctionCall = ICVCMGovernor.interface.encodeFunctionData(
    "setVotingPeriod",
    [votingPeriod]
  );

  return propose(
    ICVCMGovernor,
    ICVCMGovernor.address,
    encodedFunctionCall,
    description
  );
};

export const proposeAddProposalAuthorization = async (
  ICVCMGovernor: ICVCMGovernor,
  description: string,
  proposalAuthorization: ProposalAuthorization
) => {
  const [contractAddress, selector, role] = prepareProposalAuthorization(
    proposalAuthorization
  );
  const encodedFunctionCall =
    ICVCMRoles__factory.createInterface().encodeFunctionData(
      "addProposalAuthorization",
      [contractAddress, selector, role]
    );

  return propose(
    ICVCMGovernor,
    ContractAddresses.ICVCMRoles,
    encodedFunctionCall,
    description
  );
};

export const proposeRemoveProposalAuthorization = async (
  ICVCMGovernor: ICVCMGovernor,
  description: string,
  proposalAuthorization: ProposalAuthorization
) => {
  const [contractAddress, selector, role] = prepareProposalAuthorization(
    proposalAuthorization
  );
  const encodedFunctionCall =
    ICVCMRoles__factory.createInterface().encodeFunctionData(
      "removeProposalAuthorization",
      [contractAddress, selector, role]
    );

  return propose(
    ICVCMGovernor,
    ContractAddresses.ICVCMRoles,
    encodedFunctionCall,
    description
  );
};

export const proposeUpgradeContract = async (
  ICVCMGovernor: ICVCMGovernor,
  description: string,
  contract: Contracts,
  newImplementationAddress: string
) => {
  let encodedFunctionCall: string;
  let contractAddress: string;
  switch (contract) {
    case Contracts.ICVCMGovernor:
      encodedFunctionCall =
        ICVCMGovernor__factory.createInterface().encodeFunctionData(
          "upgradeTo",
          [newImplementationAddress]
        );
      contractAddress = ContractAddresses.ICVCMGovernor;
      break;
    case Contracts.ICVCMConstitution:
      encodedFunctionCall =
        ICVCMConstitution__factory.createInterface().encodeFunctionData(
          "upgradeTo",
          [newImplementationAddress]
        );
      contractAddress = ContractAddresses.ICVCMConstitution;
      break;
    case Contracts.ICVCMRoles:
      encodedFunctionCall =
        ICVCMRoles__factory.createInterface().encodeFunctionData("upgradeTo", [
          newImplementationAddress,
        ]);
      contractAddress = ContractAddresses.ICVCMRoles;
      break;
    case Contracts.ICVCMToken:
      encodedFunctionCall =
        ICVCMToken__factory.createInterface().encodeFunctionData("upgradeTo", [
          newImplementationAddress,
        ]);
      contractAddress = ContractAddresses.ICVCMToken;
      break;
    default:
      break;
  }

  return propose(
    ICVCMGovernor,
    contractAddress,
    encodedFunctionCall,
    description
  );
};

const prepareProposalAuthorization = (
  proposalAuthorization: ProposalAuthorization
) => {
  let contractAddress: string;
  let selector: string;
  switch (proposalAuthorization.contract) {
    case Contracts.ICVCMConstitution:
      contractAddress = ContractAddresses.ICVCMConstitution;
      selector = ICVCMConstitution__factory.createInterface().getSighash(
        proposalAuthorization.function
      );
      break;
    case Contracts.ICVCMGovernor:
      contractAddress = ContractAddresses.ICVCMGovernor;
      selector = ICVCMGovernor__factory.createInterface().getSighash(
        proposalAuthorization.function
      );
      break;
    case Contracts.ICVCMRoles:
      contractAddress = ContractAddresses.ICVCMRoles;
      selector = ICVCMRoles__factory.createInterface().getSighash(
        proposalAuthorization.function
      );
      break;

    default:
      break;
  }
  return [contractAddress, selector, proposalAuthorization.role] as const;
};

const parseProposalEvent = async (
  ICVCMGovernor: ICVCMGovernor,
  ICVCMRoles: ICVCMRoles,
  { args, getBlock }: ProposalCreatedEvent
): Promise<Proposal> => {
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
      case ICVCMRolesInterface.functions["addMember(address,uint8,bytes32)"]:
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
      case ICVCMRolesInterface.functions[
        "addProposalAuthorization(address,bytes4,uint8)"
      ]:
        var [address, selector, role] = ICVCMRolesInterface.decodeFunctionData(
          fragment,
          calldata
        );
        proposalAction = {
          action: "addProposalAuthorization",
          payload: parseProposalAuthorization(address, selector, role),
        };
        break;
      case ICVCMRolesInterface.functions[
        "removeProposalAuthorization(address,bytes4,uint8)"
      ]:
        var [address, selector, role] = ICVCMRolesInterface.decodeFunctionData(
          fragment,
          calldata
        );
        proposalAction = {
          action: "removeProposalAuthorization",
          payload: parseProposalAuthorization(address, selector, role),
        };
        break;
      case ICVCMRolesInterface.functions["upgradeTo(address)"]:
        var [implAddress] = ICVCMRolesInterface.decodeFunctionData(
          fragment,
          calldata
        );
        proposalAction = {
          action: "upgradeTo",
          payload: {
            contract: Contracts.ICVCMRoles,
            implAddress,
          },
        };
    }
  } else if (contractAddress === ContractAddresses.ICVCMConstitution) {
    // They are constitution changes
    const ICVCMConstitutionInterface =
      ICVCMConstitution__factory.createInterface();
    const fragment = ICVCMConstitutionInterface.getFunction(methodId);

    switch (fragment) {
      case ICVCMConstitutionInterface.functions["addPrinciple(string)"]:
        var [principle] = ICVCMConstitutionInterface.decodeFunctionData(
          fragment,
          calldata
        );
        proposalAction = {
          action: "addPrinciple",
          payload: { principle },
        };
        break;
      case ICVCMConstitutionInterface.functions[
        "updatePrinciple(uint256,string)"
      ]:
        var [id, principle] = ICVCMConstitutionInterface.decodeFunctionData(
          fragment,
          calldata
        );
        proposalAction = {
          action: "updatePrinciple",
          payload: { id, principle },
        };
        break;
      case ICVCMConstitutionInterface.functions["removePrinciple(uint256)"]:
        var [id] = ICVCMConstitutionInterface.decodeFunctionData(
          fragment,
          calldata
        );
        proposalAction = {
          action: "removePrinciple",
          payload: { id },
        };
        break;
      case ICVCMConstitutionInterface.functions["addStrategy(string)"]:
        var [strategy] = ICVCMConstitutionInterface.decodeFunctionData(
          fragment,
          calldata
        );
        proposalAction = {
          action: "addStrategy",
          payload: { strategy },
        };
        break;
      case ICVCMConstitutionInterface.functions[
        "updateStrategy(uint256,string)"
      ]:
        var [id, strategy] = ICVCMConstitutionInterface.decodeFunctionData(
          fragment,
          calldata
        );
        proposalAction = {
          action: "updateStrategy",
          payload: { id, strategy },
        };
        break;
      case ICVCMConstitutionInterface.functions[
        "removeStrategy(uint256,string)"
      ]:
        var [id] = ICVCMConstitutionInterface.decodeFunctionData(
          fragment,
          calldata
        );
        proposalAction = {
          action: "removeStrategy",
          payload: { id },
        };
        break;
      case ICVCMConstitutionInterface.functions["upgradeTo(address)"]:
        var [implAddress] = ICVCMConstitutionInterface.decodeFunctionData(
          fragment,
          calldata
        );
        proposalAction = {
          action: "upgradeTo",
          payload: {
            contract: Contracts.ICVCMConstitution,
            implAddress,
          },
        };
    }
  } else if (contractAddress === ContractAddresses.ICVCMGovernor) {
    const ICVCMGovernorInterface = ICVCMGovernor__factory.createInterface();
    const fragment = ICVCMGovernorInterface.getFunction(methodId);

    switch (fragment) {
      case ICVCMGovernorInterface.functions["updateQuorumNumerator(uint256)"]:
        var [quorum] = ICVCMGovernorInterface.decodeFunctionData(
          fragment,
          calldata
        );

        proposalAction = {
          action: "setVotingQuorum",
          payload: { quorum: ethers.BigNumber.from(quorum).toNumber() },
        };
        break;
      case ICVCMGovernorInterface.functions["setVotingPeriod(uint256)"]:
        var [votingPeriod] = ICVCMGovernorInterface.decodeFunctionData(
          fragment,
          calldata
        );
        proposalAction = {
          action: "setVotingPeriod",
          payload: {
            votingPeriod: ethers.BigNumber.from(votingPeriod).toNumber(),
          },
        };
        break;
      case ICVCMGovernorInterface.functions["upgradeTo(address)"]:
        var [implAddress] = ICVCMGovernorInterface.decodeFunctionData(
          fragment,
          calldata
        );
        proposalAction = {
          action: "upgradeTo",
          payload: {
            contract: Contracts.ICVCMGovernor,
            implAddress,
          },
        };
    }
  } else if (contractAddress === ContractAddresses.ICVCMToken) {
    const ICVCMTokenInterface = ICVCMToken__factory.createInterface();
    const fragment = ICVCMTokenInterface.getFunction(methodId);

    switch (fragment) {
      case ICVCMTokenInterface.functions["upgradeTo(address)"]:
        var [implAddress] = ICVCMTokenInterface.decodeFunctionData(
          fragment,
          calldata
        );
        proposalAction = {
          action: "upgradeTo",
          payload: {
            contract: Contracts.ICVCMGovernor,
            implAddress,
          },
        };
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
    deadline: await getProposalDeadline(
      ICVCMGovernor,
      proposalId,
      block.timestamp * 1e3,
      block.number
    ),
  };
};

export const getProposalDeadline = async (
  ICVCMGovernor: ICVCMGovernor,
  proposalId: string,
  startTime: number,
  startBlock: number
) => {
  const endBlock = await ICVCMGovernor.proposalDeadline(proposalId);
  const blockDiff = endBlock.toNumber() - startBlock;

  return new Date(
    blockDiff * Number(process.env.NEXT_PUBLIC_BLOCK_INTERVAL) + startTime
  );
};

export const getProposal = async (
  ICVCMGovernor: ICVCMGovernor,
  ICVCMRoles: ICVCMRoles,
  proposalId: BigNumberish
) => {
  const filter = ICVCMGovernor.filters.ProposalCreated(proposalId);
  const proposals = await ICVCMGovernor.queryFilter(filter);

  if (proposals.length === 0) {
    return null;
  }

  return parseProposalEvent(ICVCMGovernor, ICVCMRoles, proposals[0]);
};

export const getProposals = async (
  ICVCMGovernor: ICVCMGovernor,
  ICVCMRoles: ICVCMRoles
): Promise<Proposal[]> => {
  const filter = ICVCMGovernor.filters.ProposalCreated();
  const proposals = await ICVCMGovernor.queryFilter(filter);

  return Promise.all(
    proposals.map(async (proposalEvent) =>
      parseProposalEvent(ICVCMGovernor, ICVCMRoles, proposalEvent)
    )
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
    ethers.BigNumber.from(proposalId),
    null
  );
  const result = await ICVCMGovernor.queryFilter(filter);

  if (result.length === 0) {
    return;
  }
  const block = await result[0].getBlock();

  return [new Date(block.timestamp * 1e3), result[0].args.reason] as const;
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

  await mutate("getPrinciples");
  await mutate("getStrategies");
  await mutate("getProposals");
  await mutate(["getProposalExecutionEvent", proposal.proposalId]);
  await mutate(["getTotalVotesRequired", proposal.proposalId]);
  await mutate("getPrinciplesHistory");
  await mutate("getStrategiesHistory");
  await mutate("getMemberHistory");
  await mutate("getQuorum");
  await mutate("getVotingPeriod");
  await mutate("getSettingsHistory");
  await mutate("getProposalAuthorizations");
  await mutate("getContractVersions");
};

export const cancelProposal = async (
  ICVCMGovernor: ICVCMGovernor,
  proposal: Proposal,
  reason: string
) => {
  const tx = await ICVCMGovernor.cancel(
    proposal.targets,
    [0],
    proposal.calldatas,
    ethers.utils.id(proposal.description),
    reason
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

export const getQuorum = async (ICVCMGovernor: ICVCMGovernor) => {
  return ICVCMGovernor["quorumNumerator()"]();
};

export const getVotingPeriod = async (ICVCMGovernor: ICVCMGovernor) => {
  const blocks = await ICVCMGovernor.votingPeriod();
  return parseBlockToDays(blocks.toNumber());
};

export const functionNames = {
  addMember: "Add Member",
  removeMember: "Remove Member",
  addPrinciple: "Add Principle",
  updatePrinciple: "Update Principle",
  removePrinciple: "Remove Principle",
  addStrategy: "Add Strategy",
  updateStrategy: "Update Strategy",
  removeStrategy: "Remove Strategy",
  updateQuorumNumerator: "Set Voting Quorum",
  setVotingPeriod: "Set Voting Period",
  addProposalAuthorization: "Add Proposal Authorization",
  removeProposalAuthorization: "Remove Proposal Authorization",
  upgradeTo: "Upgrade Contract",
};

export const FunctionContracts = [
  ["addMember", Contracts.ICVCMRoles],
  ["removeMember", Contracts.ICVCMRoles],
  ["addPrinciple", Contracts.ICVCMConstitution],
  ["updatePrinciple", Contracts.ICVCMConstitution],
  ["removePrinciple", Contracts.ICVCMConstitution],
  ["addStrategy", Contracts.ICVCMConstitution],
  ["updateStrategy", Contracts.ICVCMConstitution],
  ["removeStrategy", Contracts.ICVCMConstitution],
  ["updateQuorumNumerator", Contracts.ICVCMGovernor],
  ["setVotingPeriod", Contracts.ICVCMGovernor],
  ["addProposalAuthorization", Contracts.ICVCMRoles],
  ["removeProposalAuthorization", Contracts.ICVCMRoles],
  ["upgradeTo", Contracts.ICVCMGovernor],
  ["upgradeTo", Contracts.ICVCMRoles],
  ["upgradeTo", Contracts.ICVCMToken],
  ["upgradeTo", Contracts.ICVCMConstitution],
] as const;

export const parseFunctionName = (name: string): string => {
  return functionNames[name];
};
