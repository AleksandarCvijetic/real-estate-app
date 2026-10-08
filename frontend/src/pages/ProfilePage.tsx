import { useAuth } from "../context/AuthContext";
import { ACCOUNT_TYPE_LABELS, ROLE_LABELS } from "../lib/userLabels";

export function ProfilePage() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  const initials = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();

  return (
    <>
      <h1 className="page-title">Profil</h1>
      <div className="profile-card">
        <div className="profile-card__avatar">{initials}</div>
        <div className="profile-card__info">
          <h2 className="profile-card__name">
            {user.firstName} {user.lastName}
          </h2>
          <p className="profile-card__email">{user.email}</p>
          <div className="profile-card__badges">
            <span className="badge badge--accent">{ACCOUNT_TYPE_LABELS[user.accountType]}</span>
            <span className="badge">{ROLE_LABELS[user.role]}</span>
          </div>
        </div>
      </div>
    </>
  );
}
