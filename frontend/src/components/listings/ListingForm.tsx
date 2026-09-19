import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { NumberField } from "../forms/NumberField";
import { getApiErrorMessage } from "../../lib/apiError";
import { EMPTY_LISTING_FORM, toCreateRequest, type ListingFormValues } from "../../lib/listingForm";
import {
  FURNISHING_LABELS,
  HEATING_LABELS,
  LISTING_TYPE_LABELS,
  PROPERTY_TYPE_LABELS,
  toOptions,
} from "../../lib/listingLabels";
import type { ListingCreateRequest } from "../../types/listing";

const LISTING_TYPE_OPTIONS = toOptions(LISTING_TYPE_LABELS);
const PROPERTY_TYPE_OPTIONS = toOptions(PROPERTY_TYPE_LABELS);
const FURNISHING_OPTIONS = toOptions(FURNISHING_LABELS);
const HEATING_OPTIONS = toOptions(HEATING_LABELS);

interface SelectFieldProps<T extends string> {
  label: string;
  value: "" | T;
  options: { value: T; label: string }[];
  onChange: (value: "" | T) => void;
}

// value ostaje engleski enum iz backenda, a label je srpski.
function SelectField<T extends string>({ label, value, options, onChange }: SelectFieldProps<T>) {
  return (
    <label className="field">
      <span>{label}</span>
      <select className="control" required value={value} onChange={(e) => onChange(e.target.value as "" | T)}>
        <option value="" disabled>
          Izaberi...
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

interface ListingFormProps {
  submitLabel: string;
  submittingLabel: string;
  cancelTo: string;
  onSubmit: (request: ListingCreateRequest) => Promise<void>;
}

export function ListingForm({ submitLabel, submittingLabel, cancelTo, onSubmit }: ListingFormProps) {
  const [values, setValues] = useState<ListingFormValues>(EMPTY_LISTING_FORM);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function set<K extends keyof ListingFormValues>(key: K, value: ListingFormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    const request = toCreateRequest(values);
    if (!request) {
      setError("Popuni sva obavezna polja.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(request);
    } catch (err) {
      setError(getApiErrorMessage(err));
      setIsSubmitting(false);
    }
  }

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      {error && <div className="alert alert--error">{error}</div>}

      <section className="form-section">
        <h2>Osnovni podaci</h2>
        <label className="field">
          <span>Naslov</span>
          <input
            className="control"
            type="text"
            required
            maxLength={255}
            placeholder="npr. Svetao dvosoban stan u centru"
            value={values.title}
            onChange={(e) => set("title", e.target.value)}
          />
        </label>

        <div className="form-grid">
          <SelectField
            label="Tip oglasa"
            value={values.listingType}
            options={LISTING_TYPE_OPTIONS}
            onChange={(v) => set("listingType", v)}
          />
          <SelectField
            label="Tip nekretnine"
            value={values.propertyType}
            options={PROPERTY_TYPE_OPTIONS}
            onChange={(v) => set("propertyType", v)}
          />
          <label className="field">
            <span>Lokacija</span>
            <input
              className="control"
              type="text"
              required
              maxLength={255}
              placeholder="npr. Novi Sad, Liman"
              value={values.location}
              onChange={(e) => set("location", e.target.value)}
            />
          </label>
        </div>
      </section>

      <section className="form-section">
        <h2>Cena i površina</h2>
        <div className="form-grid">
          <NumberField
            label={values.listingType === "RENT" ? "Mesečna cena (€)" : "Cena (€)"}
            required
            min={0.01}
            step="any"
            value={values.price}
            onChange={(v) => set("price", v)}
          />
          <NumberField
            label="Površina (m²)"
            required
            min={0.01}
            step="any"
            value={values.area}
            onChange={(v) => set("area", v)}
          />
          <NumberField
            label="Broj soba"
            required
            min={0.5}
            step={0.5}
            value={values.numberOfRooms}
            onChange={(v) => set("numberOfRooms", v)}
          />
          {values.propertyType !== "HOUSE" && (
            <NumberField
              label="Sprat (opciono)"
              min={-5}
              value={values.floor}
              onChange={(v) => set("floor", v)}
            />
          )}
        </div>
      </section>

      <section className="form-section">
        <h2>Karakteristike</h2>
        <div className="form-grid">
          <SelectField
            label="Nameštenost"
            value={values.furnishingStatus}
            options={FURNISHING_OPTIONS}
            onChange={(v) => set("furnishingStatus", v)}
          />
          <SelectField
            label="Grejanje"
            value={values.heatingType}
            options={HEATING_OPTIONS}
            onChange={(v) => set("heatingType", v)}
          />
        </div>
        <div className="filters__checks">
          <label className="check">
            <input type="checkbox" checked={values.parking} onChange={(e) => set("parking", e.target.checked)} />
            Parking
          </label>
          <label className="check">
            <input type="checkbox" checked={values.petFriendly} onChange={(e) => set("petFriendly", e.target.checked)} />
            Ljubimci dozvoljeni
          </label>
        </div>
      </section>

      <section className="form-section">
        <h2>Opis</h2>
        <textarea
          className="control control--textarea"
          required
          rows={6}
          aria-label="Opis oglasa"
          placeholder="Opiši nekretninu: stanje, okolinu, dostupnost..."
          value={values.description}
          onChange={(e) => set("description", e.target.value)}
        />
      </section>

      <div className="form-card__actions">
        <Link to={cancelTo} className="btn btn--ghost">
          Odustani
        </Link>
        <button type="submit" className="btn btn--primary" disabled={isSubmitting}>
          {isSubmitting ? submittingLabel : submitLabel}
        </button>
      </div>
    </form>
  );
}
