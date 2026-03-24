import { Outlet, useRouteLoaderData } from "react-router-dom";
import type { IUser } from "../../../../shared/interface/UserInterface";
import "./profile.css";
export default function User() {
  const user = useRouteLoaderData("root") as IUser | null;
  console.log("Données reçues par le profil :", user);
  if (!user || !user.username) return <p>Aucune donnée utilisateur</p>;
  return (
    <>
      <div className="user-card">
        {/* On retire le .map() et le <Link> car on est déjà sur la page finale */}
        <div className="user-card-item">
          <h2 className="card">Mon Profil</h2>
          <hr />
          <p className="card">
            <strong>Bonjour {user.username}</strong>
          </p>
          <p>
            <strong>Username :</strong> {user.username}
          </p>
          <p>
            <strong>Email :</strong> {user.email}
          </p>
          <p>
            <strong>Membre depuis le :</strong>{" "}
            {user.created_at
              ? new Date(user.created_at).toLocaleDateString()
              : "Date inconnue"}
          </p>
        </div>
      </div>
      <Outlet />
    </>
  );
}
