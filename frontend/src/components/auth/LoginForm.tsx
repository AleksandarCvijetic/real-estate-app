import { useState, type FormEvent } from "react";
import { isAxiosError } from "axios";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { authApi } from "../../api/authApi";
import { useAuth } from "../../context/AuthContext";
import { getApiErrorMessage } from "../../lib/apiError";

export function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  // Stranica sa koje je korisnik poslat na prijavu (header, detalji oglasa, zasticena ruta).
  const redirectTo = (location.state as { from?: string } | null)?.from ?? "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailNotVerified, setEmailNotVerified] = useState(false);
  const [info, setInfo] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setEmailNotVerified(false);
    setIsSubmitting(true);
    try {
      await login({ email, password });
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setEmailNotVerified(isAxiosError(err) && err.response?.status === 403);
      setError(getApiErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleResend() {
    try {
      await authApi.resendVerification(email);
      setError(null);
      setEmailNotVerified(false);
      setInfo("Poslali smo novi link za potvrdu. Proveri inbox.");
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h1>Prijava</h1>

      {error && <div className="auth-form__error">{error}</div>}
      {info && <div className="auth-form__info">{info}</div>}
      {emailNotVerified && (
        <button type="button" className="auth-form__link-button" onClick={handleResend}>
          Pošalji link za potvrdu ponovo
        </button>
      )}

      <label className="auth-form__field">
        <span>Email</span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
      </label>

      <label className="auth-form__field">
        <span>Lozinka</span>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />
      </label>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Prijavljivanje..." : "Prijavi se"}
      </button>

      <p className="auth-form__switch">
        Nemaš nalog? <Link to="/register">Registruj se</Link>
      </p>
      <p className="auth-form__switch">
        <Link to="/">← Nazad na oglase</Link>
      </p>
    </form>
  );
}
