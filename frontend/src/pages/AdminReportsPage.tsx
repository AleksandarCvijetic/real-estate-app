import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { listingApi } from "../api/listingApi";
import { useAsyncData } from "../hooks/useAsyncData";
import { getApiErrorMessage } from "../lib/apiError";
import { formatDate } from "../lib/format";
import { REPORT_REASON_LABELS } from "../lib/listingLabels";
import type { Report, ReportStatus } from "../types/listing";

const TABS: { status: ReportStatus; label: string }[] = [
  { status: "PENDING", label: "Na čekanju" },
  { status: "REJECTED", label: "Odbijene" },
];

export function AdminReportsPage() {
  const [status, setStatus] = useState<ReportStatus>("PENDING");
  // Reseni zahtevi se sklanjaju lokalno, bez ponovnog ucitavanja liste.
  const [resolvedReportIds, setResolvedReportIds] = useState<Set<number>>(() => new Set());
  const [deletedListingIds, setDeletedListingIds] = useState<Set<number>>(() => new Set());
  const [pendingId, setPendingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = useCallback(() => listingApi.getReports(status), [status]);
  const { data, error: loadError, isLoading } = useAsyncData(fetchReports);

  const reports = (data ?? []).filter(
    (report) => !resolvedReportIds.has(report.id) && !deletedListingIds.has(report.listingId)
  );

  // Koliko prijava na cekanju ima isti oglas - prihvatanje jedne brise oglas i sve njegove prijave.
  const countByListing = new Map<number, number>();
  reports.forEach((report) => countByListing.set(report.listingId, (countByListing.get(report.listingId) ?? 0) + 1));

  function changeTab(next: ReportStatus) {
    setStatus(next);
    setError(null);
  }

  async function handleAccept(report: Report) {
    const confirmed = window.confirm(
      `Prihvatanjem prijave oglas "${report.listingTitle}" biće trajno obrisan, zajedno sa svim njegovim prijavama. Nastaviti?`
    );
    if (!confirmed) return;

    setPendingId(report.id);
    setError(null);
    try {
      await listingApi.acceptReport(report.id);
      setDeletedListingIds((ids) => new Set(ids).add(report.listingId));
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setPendingId(null);
    }
  }

  async function handleReject(report: Report) {
    setPendingId(report.id);
    setError(null);
    try {
      await listingApi.rejectReport(report.id);
      setResolvedReportIds((ids) => new Set(ids).add(report.id));
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setPendingId(null);
    }
  }

  return (
    <>
      <h1 className="page-title">Prijavljeni oglasi</h1>

      <div className="tabs" role="tablist">
        {TABS.map((tab) => (
          <button
            key={tab.status}
            type="button"
            role="tab"
            aria-selected={status === tab.status}
            className={`tabs__tab${status === tab.status ? " is-active" : ""}`}
            onClick={() => changeTab(tab.status)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {(error ?? loadError) && <div className="alert alert--error">{error ?? loadError}</div>}
      {isLoading && <p>Učitavanje...</p>}

      {data && reports.length === 0 && (
        <div className="empty">
          {status === "PENDING" ? "Nema prijava koje čekaju odluku." : "Nema odbijenih prijava."}
        </div>
      )}

      {reports.length > 0 && (
        <ul className="report-list">
          {reports.map((report) => {
            const listingReportCount = countByListing.get(report.listingId) ?? 1;
            const isBusy = pendingId === report.id;

            return (
              <li key={report.id} className="report-item">
                <div className="report-item__main">
                  <Link to={`/listings/${report.listingId}`} className="report-item__title">
                    {report.listingTitle}
                  </Link>
                  <p className="report-item__meta">{report.listingLocation}</p>
                  <div className="listing-card__badges">
                    <span className="badge badge--danger">{REPORT_REASON_LABELS[report.reason]}</span>
                    {status === "PENDING" && listingReportCount > 1 && (
                      <span className="badge">Prijava za ovaj oglas: {listingReportCount}</span>
                    )}
                  </div>
                  <p className="report-item__meta">
                    Prijavio korisnik #{report.reportingUserId} · {formatDate(report.createdAt)}
                  </p>
                </div>

                {status === "PENDING" && (
                  <div className="report-item__actions">
                    <button
                      type="button"
                      className="btn btn--ghost"
                      onClick={() => handleReject(report)}
                      disabled={isBusy}
                    >
                      Odbij prijavu
                    </button>
                    <button
                      type="button"
                      className="btn btn--danger-solid"
                      onClick={() => handleAccept(report)}
                      disabled={isBusy}
                    >
                      Prihvati i obriši oglas
                    </button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
