import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FavoritesProvider } from "../../context/FavoritesContext";

export function AppLayout() {
  const { user, isLoading, logout } = useAuth();
  const location = useLocation();

  // key: pri prijavi/odjavi provider se pravi iznova, pa se omiljeni ne prenose izmedju korisnika.
  return (
    <FavoritesProvider key={user?.id ?? "guest"}>
      <header className="app-header">
        <div className="container app-header__inner">
          <Link to="/" className="app-header__brand">
            Real Estate
          </Link>

          <nav className="app-header__nav">
            <NavLink to="/" end>
              Oglasi
            </NavLink>
            {user && (
              <>
                <NavLink to="/my-listings">Moji oglasi</NavLink>
                <NavLink to="/favorites">Omiljeni</NavLink>
              </>
            )}
            {user?.role === "ADMIN" && <NavLink to="/admin/reports">Prijave</NavLink>}
          </nav>

          {!isLoading && (
            <div className="app-header__user">
              {user ? (
                <>
                  <Link to="/listings/new" className="btn btn--primary">
                    + Dodaj oglas
                  </Link>
                  <Link to="/profile" className="app-header__profile">
                    {user.firstName} {user.lastName}
                  </Link>
                  <button type="button" className="btn btn--ghost" onClick={() => logout()}>
                    Odjavi se
                  </button>
                </>
              ) : (
                <>
                  <Link to="/register" className="btn btn--ghost">
                    Registruj se
                  </Link>
                  <Link to="/login" state={{ from: location.pathname }} className="btn btn--primary">
                    Prijavi se
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </header>

      <main className="container app-main">
        <Outlet />
      </main>
    </FavoritesProvider>
  );
}
