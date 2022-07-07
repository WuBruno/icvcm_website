import { BigNumberish } from "ethers";
import { mutate } from "swr";
import { Vote, VoteSupport } from "~/@types";
import { ICVCMGovernor } from "~/contracts/types";

export const hasVoted = async (
  ICVCMGovernor: ICVCMGovernor,
  proposalId: BigNumberish,
  address: string
) => {
  return ICVCMGovernor.hasVoted(proposalId, address);
};

export const getVote = async (
  ICVCMGovernor: ICVCMGovernor,
  proposalId: BigNumberish,
  address: string
): Promise<Vote | null> => {
  const filter = ICVCMGovernor.filters.VoteCast(address);
  const proposals = await ICVCMGovernor.queryFilter(filter);

  const proposal = proposals.find(
    (proposal) => proposal.args.proposalId == proposalId
  );

  if (!proposal) {
    return;
  }

  return {
    proposalId,
    voter: proposal.args.voter,
    support: proposal.args.support,
  };
};

export const castVote = async (
  ICVCMGovernor: ICVCMGovernor,
  proposalId: BigNumberish,
  support: VoteSupport
) => {
  const voteTx = await ICVCMGovernor.castVote(proposalId, support);
  await voteTx.wait();

  return mutate(["getVote", proposalId]);
};
