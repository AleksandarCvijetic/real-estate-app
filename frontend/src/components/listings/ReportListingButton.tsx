import { useRef, useState, type FormEvent } from "react";
import { listingApi } from "../../api/listingApi";
import { getApiErrorMessage } from "../../lib/apiError";
import { REPORT_REASON_LABELS, toOptions } from "../../lib/listingLabels";
import type { ReportReason } from "../../types/listing";

const REASON_OPTIONS = toOptions(REPORT_REASON_LABELS);

export function ReportListingButton({ listingId }: { listingId: number }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [reason, setReason] = useState<ReportReason | "">("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReported, setIsReported] = useState(false);

  const open = () => {
    setReason("");
    setError(null);
    dialogRef.current?.showModal();
  };

  const close = () => dialogRef.current?.close();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!reason) {
      setError("Izaberi razlog prijave.");
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      await listingApi.report({ listingId, reason });
      setIsReported(true);
      close();
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isReported) {
    return <p className="report-sent">Hvala, prijava je poslata i biće razmotrena.</p>;
  }

  return (
    <>
      <button type="button" className="btn btn--ghost btn--danger" onClick={open}>
        Prijavi oglas
      </button>

      <dialog ref={dialogRef} className="dialog" aria-labelledby="report-dialog-title">
        <form className="dialog__body" onSubmit={handleSubmit}>
          <h2 id="report-dialog-title" className="dialog__title">
            Prijavi oglas
          </h2>
          <p className="dialog__text">Zašto prijavljuješ ovaj oglas?</p>

          <fieldset className="radio-list">
            <legend className="visually-hidden">Razlog prijave</legend>
            {REASON_OPTIONS.map((option) => (
              <label key={option.value} className="radio-list__item">
                <input
                  type="radio"
                  name="reason"
                  value={option.value}
                  checked={reason === option.value}
                  onChange={() => setReason(option.value)}
                />
                {option.label}
              </label>
            ))}
          </fieldset>

          {error && <div className="alert alert--error">{error}</div>}

          <div className="dialog__actions">
            <button type="button" className="btn btn--ghost" onClick={close} disabled={isSubmitting}>
              Otkaži
            </button>
            <button type="submit" className="btn btn--primary" disabled={isSubmitting}>
              {isSubmitting ? "Slanje..." : "Pošalji prijavu"}
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}
