import { Address, Bytes } from "@graphprotocol/graph-ts";
import {
  Transfer as TransferEvent,
  ProofBearer as TokenContract,
} from "../generated/ProofBearer/ProofBearer";
import { Token, Listing } from "../generated/schema";

export function handleTransfer(event: TransferEvent): void {
  let token = Token.load(event.params.tokenId.toString());
  let tokenContract = TokenContract.bind(event.address);
  if (!token) {
    token = new Token(event.params.tokenId.toString());
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
  if (
    owner.value.equals(
      Address.fromString("0x4b9e1520D6AD44C57d4e3B3B647ecCF46dA6e9d3")
    )
  ) {
    token.isListed = true;
    let listing = Listing.load(event.params.tokenId.toString());
    if (listing) {
      token.listing = listing.id;
    } else {
      let listing = new Listing(event.params.tokenId.toString());
      listing.tokenId = event.params.tokenId;
      token.listing = listing.id;
    }
  } else {
    token.isListed = false;
  }

  token.save();
}
