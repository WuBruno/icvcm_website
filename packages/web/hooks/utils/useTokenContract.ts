import ERC721_ABI from "../../contracts/ERC721.json";
import type { ERC721 } from "../../contracts/types";
import useContract from "../contracts/useContract";

export default function useTokenContract(tokenAddress?: string) {
  return useContract<ERC721>(tokenAddress, ERC721_ABI);
}
