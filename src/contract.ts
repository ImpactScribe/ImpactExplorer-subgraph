import { Bytes } from "@graphprotocol/graph-ts";
import { CreatedListing as CreatedListingEvent } from "../generated/Contract/Contract";
import { Listing, Token } from "../generated/schema";

export function handleCreatedListing(event: CreatedListingEvent): void {
  let listing = Listing.load(new Bytes(event.params.tokenId.toI32()));
  if (!listing) {
    listing = new Listing(new Bytes(event.params.tokenId.toI32()));
    listing.tokenId = event.params.tokenId;
    let token = Token.load(new Bytes(event.params.tokenId.toI32()));
    if (token !== null) {
      listing.token = token.id;
      listing.holder = token.owner;
    }
    listing.price = event.params.price;
  }
  listing.owner = event.params.owner.toHexString();
  listing.save();
}
