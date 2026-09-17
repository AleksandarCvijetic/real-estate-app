import { useAuth } from "../context/AuthContext";

export function HomePage() {
  const { user, logout } = useAuth();

  return (
    <div className="page">
      <h1>Real Estate App</h1>
      {user ? (
        <>
          <p>
            Dobrodošao/la, {user.firstName} {user.lastName} ({user.email})
          </p>
          <button onClick={() => logout()}>Odjavi se</button>
        </>
      ) : (
        <p>Nisi prijavljen.</p>
      )}
    </div>
  );
}
