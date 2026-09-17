import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getApiErrorMessage } from "../../lib/apiError";
import type { AccountType } from "../../types/auth";

export function RegisterForm() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accountType, setAccountType] = useState<AccountType>("INDIVIDUAL");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await register({ firstName, lastName, email, password, accountType });
      navigate("/");
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
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
