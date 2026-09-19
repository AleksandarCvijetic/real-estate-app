import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { authApi } from "../../api/authApi";
import { useAuth } from "../../context/AuthContext";
import { getApiErrorMessage } from "../../lib/apiError";
import type { AccountType } from "../../types/auth";

export function RegisterForm() {
  const { register } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accountType, setAccountType] = useState<AccountType>("INDIVIDUAL");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);
  const [resendStatus, setResendStatus] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await register({ firstName, lastName, email, password, accountType });
      setRegisteredEmail(email);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleResend() {
    if (!registeredEmail) return;
    setResendStatus(null);
    try {
      await authApi.resendVerification(registeredEmail);
      setResendStatus("Poslali smo novi link. Proveri inbox.");
    } catch (err) {
      setResendStatus(getApiErrorMessage(err));
    }
  }

  if (registeredEmail) {
    return (
      <div className="auth-form">
        <h1>Proveri email</h1>
        <p>
          Poslali smo link za potvrdu na <strong>{registeredEmail}</strong>. Nalog možeš da koristiš tek nakon što
          potvrdiš email adresu.
        </p>
        {resendStatus && <div className="auth-form__info">{resendStatus}</div>}
        <button type="button" className="auth-form__link-button" onClick={handleResend}>
          Pošalji link ponovo
        </button>
        <p className="auth-form__switch">
          <Link to="/login">Nazad na prijavu</Link>
        </p>
      </div>
    );
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h1>Registracija</h1>

      {error && <div className="auth-form__error">{error}</div>}

      <div className="auth-form__row">
        <label className="auth-form__field">
          <span>Ime</span>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            autoComplete="given-name"
          />
        </label>

        <label className="auth-form__field">
          <span>Prezime</span>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            autoComplete="family-name"
          />
        </label>
      </div>

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
          minLength={8}
          autoComplete="new-password"
        />
        <small>Najmanje 8 karaktera</small>
      </label>

      <label className="auth-form__field">
        <span>Tip naloga</span>
        <select value={accountType} onChange={(e) => setAccountType(e.target.value as AccountType)}>
          <option value="INDIVIDUAL">Fizičko lice</option>
          <option value="AGENT">Agent</option>
        </select>
      </label>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Kreiranje naloga..." : "Registruj se"}
      </button>

      <p className="auth-form__switch">
        Već imaš nalog? <Link to="/login">Prijavi se</Link>
      </p>
    </form>
  );
}
