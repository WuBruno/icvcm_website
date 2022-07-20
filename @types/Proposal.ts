export type Proposal = {
  proposalId: string;
  description: string;
  state: ProposalState;
  targets: string[];
  calldatas: string[];
};

export enum ProposalState {
  Pending = 0,
  Active,
  Canceled,
  Defeated,
  Succeeded,
  Queued,
  Expired,
  Executed,
}
