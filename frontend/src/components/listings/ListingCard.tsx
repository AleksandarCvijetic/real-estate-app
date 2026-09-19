import { Link } from "react-router-dom";
import type { Listing } from "../../types/listing";
import { formatArea, formatFloor, formatPrice, formatRooms } from "../../lib/format";
import {
  LISTING_STATUS_BADGES,
  LISTING_STATUS_LABELS,
  LISTING_TYPE_LABELS,
  PROPERTY_TYPE_LABELS,
} from "../../lib/listingLabels";

interface ListingCardProps {
  listing: Listing;
  showStatus?: boolean;
}

export function ListingCard({ listing, showStatus = false }: ListingCardProps) {
  return (
    <Link to={`/listings/${listing.id}`} className="listing-card">
      <div className="listing-card__badges">
        <span className="badge badge--accent">{LISTING_TYPE_LABELS[listing.listingType]}</span>
        <span className="badge">{PROPERTY_TYPE_LABELS[listing.propertyType]}</span>
        {showStatus && (
          <span className={`badge ${LISTING_STATUS_BADGES[listing.status]}`}>{LISTING_STATUS_LABELS[listing.status]}</span>
        )}
      </div>

      <h3 className="listing-card__title">{listing.title}</h3>
      <p className="listing-card__location">{listing.location}</p>

      <p className="listing-card__price">
        {formatPrice(listing.price)}
        {listing.listingType === "RENT" && <small> / mesečno</small>}
      </p>

      <ul className="listing-card__specs">
        <li>{formatArea(listing.area)}</li>
        <li>{formatRooms(listing.numberOfRooms)}</li>
        {listing.floor != null && <li>{formatFloor(listing.floor)}</li>}
      </ul>

      {(listing.parking || listing.petFriendly) && (
        <div className="listing-card__badges">
          {listing.parking && <span className="badge">Parking</span>}
          {listing.petFriendly && <span className="badge">Ljubimci dozvoljeni</span>}
        </div>
      )}
    </Link>
  );
}
