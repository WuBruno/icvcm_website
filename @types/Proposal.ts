import { Member } from "./Roles";

export type Proposal = {
  proposalId: string;
  description: string;
  state: ProposalState;
  targets: string[];
  calldatas: string[];
  proposer: Member;
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
