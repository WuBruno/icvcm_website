import { BigNumberish, ethers } from "ethers";
import { mutate } from "swr";
import { MemberVote, Vote, VoteSupport } from "~/@types";
import { ICVCMGovernor, ICVCMRoles } from "~/contracts/types";
import { getMember } from "./members";

export const hasVoted = async (
  ICVCMGovernor: ICVCMGovernor,
  proposalId: BigNumberish,
  address: string
) => {
  return ICVCMGovernor.hasVoted(proposalId, address);
};

export const getVote = async (
  ICVCMGovernor: ICVCMGovernor,
  proposalId: string,
  address: string
): Promise<Vote | null> => {
  const filter = ICVCMGovernor.filters.VoteCast(
    address,
    ethers.BigNumber.from(proposalId)
  );
  const proposals = await ICVCMGovernor.queryFilter(filter);

  if (proposals.length === 0) {
    return null;
  }

  const proposal = proposals[0];
  const block = await proposal.getBlock();

  return {
    proposalId,
    support: proposal.args.support,
    time: new Date(block.timestamp * 1e3),
    reason: proposal.args.reason,
  };
};

export const getVotes = async (
  ICVCMGovernor: ICVCMGovernor,
  ICVCMRoles: ICVCMRoles,
  proposalId: string
): Promise<MemberVote[]> => {
  const filter = ICVCMGovernor.filters.VoteCast(
    null,
    ethers.BigNumber.from(proposalId)
  );
  const votes = await ICVCMGovernor.queryFilter(filter);

  return Promise.all(
    votes.map(async (vote) => {
      const block = await vote.getBlock();
      const member = await getMember(ICVCMRoles, vote.args.voter);
      return {
        proposalId,
        voter: member,
        support: vote.args.support,
        time: new Date(block.timestamp * 1e3),
        reason: vote.args.reason,
      };
    })
  );
};

export const castVote = async (
  ICVCMGovernor: ICVCMGovernor,
  proposalId: string,
  support: VoteSupport,
  reason = ""
) => {
  const voteTx = await ICVCMGovernor.castVoteWithReason(
    proposalId,
    support,
    reason
  );
  const signerAddress = await ICVCMGovernor.signer.getAddress();

  await voteTx.wait();

  mutate(["getVote", proposalId, signerAddress]);
  mutate(["getVotes", proposalId]);
};
