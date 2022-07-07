import { BigNumberish } from "ethers";

export enum VoteSupport {
  Against = 0,
  For = 1,
  Abstain = 2,
}

export type Vote = {
  proposalId: BigNumberish;
  voter: string;
  support: VoteSupport;
};
