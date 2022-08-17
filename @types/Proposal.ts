import { Member, ProposalAuthorization } from "./Roles";

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

type EditPrinciplesAction = Action & {
  action: "editPrinciples";
  payload: {
    principles: string;
  };
};

type EditStrategiesAction = Action & {
  action: "editStrategies";
  payload: {
    strategies: string;
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

export type ProposalAction =
  | AddMemberAction
  | RemoveMemberAction
  | EditPrinciplesAction
  | EditStrategiesAction
  | SetVotingQuorum
  | SetVotingPeriod
  | AddProposalAuthorization
  | RemoveProposalAuthorization;
