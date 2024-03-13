import { Bytes } from "@graphprotocol/graph-ts";
import { CreatedListing as CreatedListingEvent } from "../generated/Contract/Contract";
import { Listing, Token } from "../generated/schema";

export function handleCreatedListing(event: CreatedListingEvent): void {
  let listing = Listing.load(event.params.tokenId.toString());
  if (!listing) {
    listing = new Listing(event.params.tokenId.toString());
    listing.tokenId = event.params.tokenId;
    listing.price = event.params.price;
  }
  listing.tokenId = event.params.tokenId;
  listing.price = event.params.price;
  listing.owner = event.params.owner.toHexString();
  listing.save();
}
