export type Proposal = {
  proposalId: string;
  description: string;
  state: ProposalState;
};

export enum ProposalState {
  Pending,
  Active,
  Canceled,
  Defeated,
  Succeeded,
  Queued,
  Expired,
  Executed,
}
