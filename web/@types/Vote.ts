import { BigNumberish } from "ethers";
import { Member } from "./Roles";

export enum VoteSupport {
  Against = 0,
  For = 1,
  Abstain = 2,
}

export type Vote = {
  proposalId: BigNumberish;
  support: VoteSupport;
  time: Date;
  reason?: string;
};

export type MemberVote = Vote & {
  voter: Member;
};
