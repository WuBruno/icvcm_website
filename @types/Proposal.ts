import { Contracts, Member, ProposalAuthorization } from "./Roles";

export type Proposal = {
  proposalId: string;
  description: string;
  state: ProposalState;
  targets: string[];
  calldatas: string[];
  proposer: Member;
  time: Date;
  proposalAction: ProposalAction;
  deadline: Date;
};

export enum ProposalState {
  Pending = 0,
  Active,
  Cancelled,
  Defeated,
  Succeeded,
  Queued,
  Expired,
  Executed,
}

type Action = {
  action: string;
  payload: unknown;
};

type AddMemberAction = Action & {
  action: "addMember";
  payload: {
    member: Member;
  };
};

type RemoveMemberAction = Action & {
  action: "removeMember";
  payload: {
    member: Member;
  };
};

type AddPrincipleAction = Action & {
  action: "addPrinciple";
  payload: {
    principle: string;
  };
};

type UpdatePrincipleAction = Action & {
  action: "updatePrinciple";
  payload: {
    id: number;
    principle: string;
  };
};

type RemovePrincipleAction = Action & {
  action: "removePrinciple";
  payload: {
    id: number;
  };
};

type AddStrategyAction = Action & {
  action: "addStrategy";
  payload: {
    strategy: string;
  };
};

type UpdateStrategyAction = Action & {
  action: "updateStrategy";
  payload: {
    id: number;
    strategy: string;
  };
};

type RemoveStrategyAction = Action & {
  action: "removeStrategy";
  payload: {
    id: number;
  };
};

type SetVotingQuorum = Action & {
  action: "setVotingQuorum";
  payload: {
    quorum: number;
  };
};

type SetVotingPeriod = Action & {
  action: "setVotingPeriod";
  payload: {
    votingPeriod: number;
  };
};

type AddProposalAuthorization = Action & {
  action: "addProposalAuthorization";
  payload: ProposalAuthorization;
};

type RemoveProposalAuthorization = Action & {
  action: "removeProposalAuthorization";
  payload: ProposalAuthorization;
};

type UpgradeContract = Action & {
  action: "upgradeTo";
  payload: {
    contract: Contracts;
    implAddress: string;
  };
};

export type ProposalAction =
  | AddMemberAction
  | RemoveMemberAction
  | AddPrincipleAction
  | UpdatePrincipleAction
  | RemovePrincipleAction
  | AddStrategyAction
  | UpdateStrategyAction
  | RemoveStrategyAction
  | SetVotingQuorum
  | SetVotingPeriod
  | AddProposalAuthorization
  | RemoveProposalAuthorization
  | UpgradeContract;
