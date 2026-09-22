import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export function AppLayout() {
  const { user, logout } = useAuth();

  return (
    <>
      <header className="app-header">
        <div className="container app-header__inner">
          <Link to="/" className="app-header__brand">
            Real Estate
          </Link>

          <nav className="app-header__nav">
            <NavLink to="/" end>
              Oglasi
            </NavLink>
            <NavLink to="/my-listings">Moji oglasi</NavLink>
          </nav>

          <div className="app-header__user">
            <Link to="/listings/new" className="btn btn--primary">
              + Dodaj oglas
            </Link>
            {user && (
              <Link to="/profile" className="app-header__profile">
                {user.firstName} {user.lastName}
              </Link>
            )}
            <button type="button" className="btn btn--ghost" onClick={() => logout()}>
              Odjavi se
            </button>
          </div>
        </div>
      </header>

      <main className="container app-main">
        <Outlet />
      </main>
    </>
  );
}
