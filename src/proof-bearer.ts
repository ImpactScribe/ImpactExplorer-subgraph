import {
  Transfer as TransferEvent,
  ProofBearer as TokenContract,
} from "../generated/ProofBearer/ProofBearer";
import { Token } from "../generated/schema";

export function handleTransfer(event: TransferEvent): void {
  let entity = new Token(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  let tokenContract = TokenContract.bind(event.address);
  entity.tokenId = event.params.tokenId;
  let ipfsUri = tokenContract.try_tokenURI(event.params.tokenId);
  if (ipfsUri.reverted) {
    return;
  }
  entity.ipfsUri = ipfsUri.value;
  let owner = tokenContract.try_ownerOf(event.params.tokenId);
  if (owner.reverted) {
    return;
  }
  entity.owner = owner.value;
  let tokenAccount = tokenContract.try_tokenAccount(event.params.tokenId);
  if (tokenAccount.reverted) {
    return;
  }
  entity.tokenAccount = tokenAccount.value;
  entity.save();
}
