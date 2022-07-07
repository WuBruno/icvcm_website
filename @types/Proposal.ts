export type Proposal = {
  proposalId: string;
  description: string;
  state: ProposalState;
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
