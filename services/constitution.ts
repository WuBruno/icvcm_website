import { BigNumber, ethers } from "ethers";
import { Proposal } from "~/@types";
import { Contracts, Member, Roles } from "~/@types/Roles";
import {
  ICVCMGovernor,
  ICVCMGovernor__factory,
  ICVCMRoles,
  ICVCMToken,
} from "~/contracts/types";
import { TypedEvent } from "~/contracts/types/common";
import { ICVCMConstitution } from "~/contracts/types/ICVCMConstitution";
import { parseFunctionName, parseProposalAuthorization } from "./members";
import { getProposal } from "./proposals";

export type ConstitutionChange = {
  time: Date;
  proposal?: Proposal;
  type: string;
  value: string;
};
export type PrincipleChanges = ConstitutionChange & {
  type: "principle";
};
export type StrategyChanges = ConstitutionChange & {
  type: "strategy";
};
export type MemberChanges = ConstitutionChange & {
  type: "member";
  operation: "add" | "remove";
  member: Member;
};
export type SettingChanges = ConstitutionChange & {
  type: "settings";
  operation:
    | "quorum"
    | "period"
    | "addProposalAuthorization"
    | "removeProposalAuthorization"
    | "upgrade";
};

export const getPrinciples = async (constitution: ICVCMConstitution) =>
  constitution.getPrinciples();

export const getStrategies = async (constitution: ICVCMConstitution) =>
  constitution.getStrategies();

export const getPrinciplesHistory = async (
  governor: ICVCMGovernor,
  roles: ICVCMRoles,
  constitution: ICVCMConstitution
): Promise<PrincipleChanges[]> => {
  const filters = constitution.filters.UpdatePrinciples();
  const events = await constitution.queryFilter(filters);
  events.reverse();
  const governorInterface = ICVCMGovernor__factory.createInterface();

  return Promise.all(
    events.map(async (event) => {
      const { time, proposal } = await getEventProposal(governor, roles, event);

      return {
        value: event.args.newPrinciples,
        time,
        proposal,
        type: "principle",
      };
    })
  );
};

export const getStrategiesHistory = async (
  governor: ICVCMGovernor,
  roles: ICVCMRoles,
  constitution: ICVCMConstitution
): Promise<StrategyChanges[]> => {
  const filters = constitution.filters.UpdateStrategies();
  const events = await constitution.queryFilter(filters);
  events.reverse();
  const governorInterface = ICVCMGovernor__factory.createInterface();

  return Promise.all(
    events.map(async (event) => {
      const { time, proposal } = await getEventProposal(governor, roles, event);
      return {
        value: event.args.newStrategies,
        time,
        proposal,
        type: "strategy",
      };
    })
  );
};

export const getMemberHistory = async (
  governor: ICVCMGovernor,
  roles: ICVCMRoles
): Promise<MemberChanges[]> => {
  const addFilter = roles.filters.MemberAdded();
  const removeFilter = roles.filters.MemberRemoved();

  const addEvents = await roles.queryFilter(addFilter);
  const removeEvents = await roles.queryFilter(removeFilter);

  const add = await Promise.all(
    addEvents.map(async (event): Promise<MemberChanges> => {
      const { time, proposal } = await getEventProposal(governor, roles, event);

      return {
        value: "",
        time,
        proposal,
        type: "member",
        operation: "add",
        member: {
          memberAddress: event.args[0],
          role: event.args[1],
          name: ethers.utils.parseBytes32String(event.args[2]),
        },
      };
    })
  );

  const remove = await Promise.all(
    removeEvents.map(async (event): Promise<MemberChanges> => {
      const { time, proposal } = await getEventProposal(governor, roles, event);

      return {
        value: "",
        time,
        proposal,
        type: "member",
        operation: "remove",
        member: {
          memberAddress: event.args[0],
          role: event.args[1],
          name: ethers.utils.parseBytes32String(event.args[2]),
        },
      };
    })
  );

  return [...add, ...remove].sort(
    (a, b) => b.time.getTime() - a.time.getTime()
  );
};

export const getSettingsHistory = async (
  governor: ICVCMGovernor,
  roles: ICVCMRoles,
  constitution: ICVCMConstitution,
  token: ICVCMToken
): Promise<SettingChanges[]> => {
  const quorumFilter = governor.filters.QuorumNumeratorUpdated();
  const quorumEvents = await governor.queryFilter(quorumFilter);

  const periodFilter = governor.filters.VotingPeriodSet();
  const periodEvents = await governor.queryFilter(periodFilter);

  const addAuthFilter = roles.filters.ProposalAuthorizationAdded();
  const addAuthEvents = await roles.queryFilter(addAuthFilter);

  const removeAuthFilter = roles.filters.ProposalAuthorizationRemoved();
  const removeAuthEvents = await roles.queryFilter(removeAuthFilter);

  const upgradeGovernorFilter = governor.filters.ContractUpgraded();
  const upgradeGovernorEvents = await governor.queryFilter(
    upgradeGovernorFilter
  );
  const upgradeRolesFilter = roles.filters.ContractUpgraded();
  const upgradeRolesEvents = await roles.queryFilter(upgradeRolesFilter);
  const upgradeTokenFilter = token.filters.ContractUpgraded();
  const upgradeTokenEvents = await token.queryFilter(upgradeTokenFilter);
  const upgradeConstitutionFilter = constitution.filters.ContractUpgraded();
  const upgradeConstitutionEvents = await constitution.queryFilter(
    upgradeConstitutionFilter
  );

  const governorInterface = ICVCMGovernor__factory.createInterface();

  const quorum = await Promise.all(
    quorumEvents.map(async (event): Promise<SettingChanges> => {
      const { time, proposal } = await getEventProposal(governor, roles, event);
      return {
        value: `${event.args.newQuorumNumerator.toString()}`,
        time,
        proposal,
        type: "settings",
        operation: "quorum",
      };
    })
  );

  const period = await Promise.all(
    periodEvents.map(async (event): Promise<SettingChanges> => {
      const { time, proposal } = await getEventProposal(governor, roles, event);

      return {
        value: `${event.args.newVotingPeriod.toString()}`,
        time,
        proposal,
        type: "settings",
        operation: "period",
      };
    })
  );

  const addAuth = await Promise.all(
    addAuthEvents.map(async (event): Promise<SettingChanges> => {
      const { time, proposal } = await getEventProposal(governor, roles, event);
      const { function: functionName, role } = parseProposalAuthorization(
        event.args.contractAddress,
        event.args.selector,
        event.args.role
      );

      return {
        value: `Add Proposal Authorization of ${
          Roles[role]
        } to ${parseFunctionName(functionName)}`,
        time,
        proposal,
        type: "settings",
        operation: "addProposalAuthorization",
      };
    })
  );

  const removeAuth = await Promise.all(
    removeAuthEvents.map(async (event): Promise<SettingChanges> => {
      const { time, proposal } = await getEventProposal(governor, roles, event);
      const { function: functionName, role } = parseProposalAuthorization(
        event.args.contractAddress,
        event.args.selector,
        event.args.role
      );

      return {
        value: `Remove Proposal Authorization of ${
          Roles[role]
        } to ${parseFunctionName(functionName)}`,
        time,
        proposal,
        type: "settings",
        operation: "removeProposalAuthorization",
      };
    })
  );

  const upgradeGovernor = await Promise.all(
    upgradeGovernorEvents.map(async (event): Promise<SettingChanges> => {
      const { time, proposal } = await getEventProposal(governor, roles, event);
      return {
        value: `ICVCMGovernor deployed version: ${event.args.version}`,
        time,
        proposal,
        type: "settings",
        operation: "upgrade",
      };
    })
  );
  const upgradeRole = await Promise.all(
    upgradeRolesEvents.map(async (event): Promise<SettingChanges> => {
      const { time, proposal } = await getEventProposal(governor, roles, event);
      return {
        value: `ICVCMRoles deployed version: ${event.args.version}`,
        time,
        proposal,
        type: "settings",
        operation: "upgrade",
      };
    })
  );
  const upgradeToken = await Promise.all(
    upgradeTokenEvents.map(async (event): Promise<SettingChanges> => {
      const { time, proposal } = await getEventProposal(governor, roles, event);
      return {
        value: `ICVCMToken deployed version: ${event.args.version}`,
        time,
        proposal,
        type: "settings",
        operation: "upgrade",
      };
    })
  );
  const upgradeConstitution = await Promise.all(
    upgradeConstitutionEvents.map(async (event): Promise<SettingChanges> => {
      const { time, proposal } = await getEventProposal(governor, roles, event);
      return {
        value: `ICVCMConstitution deployed version: ${event.args.version}`,
        time,
        proposal,
        type: "settings",
        operation: "upgrade",
      };
    })
  );

  return [
    ...quorum,
    ...period,
    ...addAuth,
    ...removeAuth,
    ...upgradeGovernor,
    ...upgradeRole,
    ...upgradeToken,
    ...upgradeConstitution,
  ].sort((a, b) => b.time.getTime() - a.time.getTime());
};

export const getEventProposal = async <TEvent extends TypedEvent>(
  governor: ICVCMGovernor,
  roles: ICVCMRoles,
  event: TEvent
) => {
  const block = await event.getBlock();
  const txn = await event.getTransactionReceipt();
  let proposal;

  if (txn.logs[0].address == governor.address) {
    const proposalId = governor.interface.parseLog(txn.logs[0]).args[0];
    proposal = await getProposal(governor, roles, proposalId);
  }

  return {
    time: new Date(block.timestamp * 1e3),
    proposal,
  };
};

export const getContractVersions = (
  ICVCMGovernor: ICVCMGovernor,
  ICVCMRoles: ICVCMRoles,
  ICVCMToken: ICVCMToken,
  ICVCMConstitution: ICVCMConstitution
): Promise<[BigNumber, Contracts][]> => {
  return Promise.all(
    [
      [ICVCMGovernor, Contracts.ICVCMGovernor] as const,
      [ICVCMRoles, Contracts.ICVCMRoles] as const,
      [ICVCMToken, Contracts.ICVCMToken] as const,
      [ICVCMConstitution, Contracts.ICVCMConstitution] as const,
    ].map(async ([contract, c]) => [await contract.getVersion(), c])
  );
};
