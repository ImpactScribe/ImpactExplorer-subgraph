import { Bytes } from "@graphprotocol/graph-ts";
import {
  Transfer as TransferEvent,
  ProofBearer as TokenContract,
} from "../generated/ProofBearer/ProofBearer";
import { Token, Listing } from "../generated/schema";

export function handleTransfer(event: TransferEvent): void {
  let token = Token.load(new Bytes(event.params.tokenId.toI32()));
  let tokenContract = TokenContract.bind(event.address);
  if (!token) {
    token = new Token(new Bytes(event.params.tokenId.toI32()));
    token.tokenId = event.params.tokenId;
    let ipfsUri = tokenContract.try_tokenURI(event.params.tokenId);
    if (ipfsUri.reverted) {
      return;
    }
    token.ipfsUri = ipfsUri.value;

    let tokenAccount = tokenContract.try_tokenAccount(event.params.tokenId);
    if (tokenAccount.reverted) {
      return;
    }
    token.tokenAccount = tokenAccount.value;
  }
  let owner = tokenContract.try_ownerOf(event.params.tokenId);
  if (owner.reverted) {
    return;
  }
  token.owner = owner.value.toHexString();
  token.from = event.params.from.toHexString();
  token.to = event.params.to.toHexString();
  token.save();
}
