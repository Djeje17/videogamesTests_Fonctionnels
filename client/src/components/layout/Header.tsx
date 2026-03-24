import {
  Link,
  //useNavigate,
  useRevalidator,
  useRouteLoaderData,
} from "react-router-dom";
import type { IUser } from "../../../../shared/interface/UserInterface";
export default function Header() {
  //const navigate = useNavigate();
  const revalidator = useRevalidator();
  const user = useRouteLoaderData("root") as IUser | null;

  const handleLogout = async () => {
    // Appel au backend pour vider le cookie
    try {
      await fetch("http://localhost:3310/api/logout", {
        method: "POST",
        credentials: "include",
      });
      revalidator.revalidate();
      // Redirection vers l'accueil et rechargement des données
      //navigate("/");
      window.location.reload();
      window.location.href = "/";
    } catch (err) {
      window.location.href = "/";
    } // Pour forcer la mise à jour des loaders
  };
  return (
    <>
      <header>
        <h4 className="logo">Projet Videogames</h4>
      </header>

      <nav className="navbar">
        <ul>
          {/* Liens de navigation internes */}
          <li>
            <Link to="/">Home</Link>
          </li>
          {user ? (
            <>
              <li>
                <Link to="/profile">Profil de {user?.username}</Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={handleLogout}
                  style={{
                    background: "none",
                    border: "none",
                    color: "inherit",
                    cursor: "pointer",
                    font: "inherit",
                  }}
                >
                  Déconnexion
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/connection">Login</Link>
              </li>
              <li>
                <Link to="/register">Register</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </>
  );
}
