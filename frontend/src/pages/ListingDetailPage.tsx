import { useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { listingApi } from "../api/listingApi";
import { useAuth } from "../context/AuthContext";
import { useAsyncData } from "../hooks/useAsyncData";
import { formatArea, formatBoolean, formatDate, formatFloor, formatPrice, formatRooms } from "../lib/format";
import {
  FURNISHING_LABELS,
  HEATING_LABELS,
  LISTING_STATUS_BADGES,
  LISTING_STATUS_LABELS,
  LISTING_TYPE_LABELS,
  PROPERTY_TYPE_LABELS,
} from "../lib/listingLabels";

export function ListingDetailPage() {
  const { id = "" } = useParams();
  const { user } = useAuth();

  const fetchListing = useCallback(() => listingApi.getById(id), [id]);
  const { data: listing, error, isLoading } = useAsyncData(fetchListing);

  const facts = listing
    ? [
        { label: "Tip oglasa", value: LISTING_TYPE_LABELS[listing.listingType] },
        { label: "Tip nekretnine", value: PROPERTY_TYPE_LABELS[listing.propertyType] },
        { label: "Površina", value: formatArea(listing.area) },
        { label: "Broj soba", value: formatRooms(listing.numberOfRooms) },
        ...(listing.floor != null ? [{ label: "Sprat", value: formatFloor(listing.floor) }] : []),
        { label: "Nameštenost", value: FURNISHING_LABELS[listing.furnishingStatus] },
        { label: "Grejanje", value: HEATING_LABELS[listing.heatingType] },
        { label: "Parking", value: formatBoolean(listing.parking) },
        { label: "Ljubimci dozvoljeni", value: formatBoolean(listing.petFriendly) },
        { label: "Objavljeno", value: formatDate(listing.createdAt) },
      ]
    : [];

  return (
    <>
      <Link to="/" className="back-link">
        ← Nazad na oglase
      </Link>

      {error && <div className="alert alert--error">{error}</div>}
      {isLoading && <p>Učitavanje...</p>}

      {listing && (
        <article className="detail">
          <header className="detail__header">
            <div className="listing-card__badges">
              <span className="badge badge--accent">{LISTING_TYPE_LABELS[listing.listingType]}</span>
              <span className={`badge ${LISTING_STATUS_BADGES[listing.status]}`}>
                {LISTING_STATUS_LABELS[listing.status]}
              </span>
              {user?.id === listing.ownerId && <span className="badge badge--accent">Tvoj oglas</span>}
            </div>
            <h1 className="detail__title">{listing.title}</h1>
            <p className="detail__location">{listing.location}</p>
            <p className="detail__price">
              {formatPrice(listing.price)}
              {listing.listingType === "RENT" && <small> / mesečno</small>}
            </p>
          </header>

          <section className="detail__section">
            <h2>Karakteristike</h2>
            <dl className="detail__facts">
              {facts.map((fact) => (
                <div key={fact.label} className="detail__fact">
                  <dt>{fact.label}</dt>
                  <dd>{fact.value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="detail__section">
            <h2>Opis</h2>
            <p className="detail__description">{listing.description}</p>
          </section>
        </article>
      )}
    </>
  );
}
