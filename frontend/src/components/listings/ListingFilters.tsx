import type { FormEvent } from "react";
import type { ListingFilterValues } from "../../lib/listingFilters";
import { LISTING_TYPE_LABELS, PROPERTY_TYPE_LABELS, toOptions } from "../../lib/listingLabels";

const LISTING_TYPE_OPTIONS = toOptions(LISTING_TYPE_LABELS);
const PROPERTY_TYPE_OPTIONS = toOptions(PROPERTY_TYPE_LABELS);

interface ListingFiltersProps {
  values: ListingFilterValues;
  onChange: (values: ListingFilterValues) => void;
  onSubmit: () => void;
  onReset: () => void;
}

interface NumberFieldProps {
  label: string;
  value: string;
  step?: number;
  onChange: (value: string) => void;
}

function NumberField({ label, value, step = 1, onChange }: NumberFieldProps) {
  return (
    <label className="field">
      <span>{label}</span>
      <input
        className="control"
        type="number"
        min={0}
        step={step}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

export function ListingFilters({ values, onChange, onSubmit, onReset }: ListingFiltersProps) {
  function set<K extends keyof ListingFilterValues>(key: K, value: ListingFilterValues[K]) {
    onChange({ ...values, [key]: value });
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit();
  }

  return (
    <form className="filters" onSubmit={handleSubmit}>
      <div className="filters__search">
        <input
          className="control"
          type="search"
          placeholder="Pretraži po lokaciji (grad, naselje, ulica)..."
          aria-label="Pretraga po lokaciji"
          value={values.location}
          onChange={(e) => set("location", e.target.value)}
        />
        <button type="submit" className="btn btn--primary">
          Pretraži
        </button>
      </div>

      <div className="filters__grid">
        <label className="field">
          <span>Tip oglasa</span>
          <select
            className="control"
            value={values.listingType}
            onChange={(e) => set("listingType", e.target.value as ListingFilterValues["listingType"])}
          >
            <option value="">Sve</option>
            {LISTING_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Tip nekretnine</span>
          <select
            className="control"
            value={values.propertyType}
            onChange={(e) => set("propertyType", e.target.value as ListingFilterValues["propertyType"])}
          >
            <option value="">Sve</option>
            {PROPERTY_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <NumberField label="Cena od (€)" value={values.minPrice} onChange={(v) => set("minPrice", v)} />
        <NumberField label="Cena do (€)" value={values.maxPrice} onChange={(v) => set("maxPrice", v)} />
        <NumberField label="Površina od (m²)" value={values.minArea} onChange={(v) => set("minArea", v)} />
        <NumberField label="Površina do (m²)" value={values.maxArea} onChange={(v) => set("maxArea", v)} />
        <NumberField label="Min. broj soba" step={0.5} value={values.minRooms} onChange={(v) => set("minRooms", v)} />
      </div>

      <div className="filters__footer">
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

        <div className="filters__actions">
          <button type="button" className="btn btn--ghost" onClick={onReset}>
            Poništi
          </button>
          <button type="submit" className="btn btn--primary">
            Primeni filtere
          </button>
        </div>
      </div>
    </form>
  );
}
