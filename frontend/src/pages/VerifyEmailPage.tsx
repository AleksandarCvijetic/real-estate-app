import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { authApi } from "../api/authApi";
import { getApiErrorMessage } from "../lib/apiError";

type Status = "loading" | "success" | "error";

export function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<Status>(token ? "loading" : "error");
  const [error, setError] = useState<string | null>(token ? null : "Link za potvrdu nije ispravan.");

  // Token je jednokratan, a StrictMode u developmentu pokreće effect dvaput.
  const requestedRef = useRef(false);

  useEffect(() => {
    if (!token || requestedRef.current) return;
    requestedRef.current = true;

    authApi
      .verifyEmail(token)
      .then(() => setStatus("success"))
      .catch((err) => {
        setError(getApiErrorMessage(err));
        setStatus("error");
      });
  }, [token]);

  return (
    <div className="auth-page">
      <div className="auth-form">
        {status === "loading" && <h1>Potvrda emaila...</h1>}

        {status === "success" && (
          <>
            <h1>Email potvrđen</h1>
            <div className="auth-form__info">Nalog je aktiviran. Sada možeš da se prijaviš.</div>
            <p className="auth-form__switch">
              <Link to="/login">Prijavi se</Link>
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <h1>Potvrda nije uspela</h1>
            <div className="auth-form__error">{error}</div>
            <p className="auth-form__switch">
              Na prijavi možeš da zatražiš novi link. <Link to="/login">Prijava</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
