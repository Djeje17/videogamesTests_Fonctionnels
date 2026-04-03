import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Login from "./pages/connection/connection";
import InfosPage from "./pages/infosArbalete/infos";
import User from "./pages/profile/profile";
import Register from "./pages/register/register";

// --- COMPOSANT CARTE DE JEU (SÉPARÉ) ---
function GameCard({
  title,
  description,
  engine,
  status,
}: { title: string; description: string; engine: string; status: string }) {
  return (
    <div className="game-card">
      <div className="game-card-header">
        <span className="game-engine-tag">{engine}</span>
      </div>
      <div className="game-card-content">
        <h3 className="game-card-title">{title}</h3>
        <p className="game-card-description">{description}</p>
        <div className="game-card-footer">
          <span
            className={`status-badge ${status.toLowerCase().replace(/\s+/g, "-")}`}
          >
            {status}
          </span>
        </div>
      </div>
    </div>
  );
}

// --- PAGE D'ACCUEIL ---
function Home() {
  const fakeGames = [
    {
      title: "Project Nova",
      description:
        "Un shooter spatial nerveux avec une gestion de gravité zéro.",
      engine: "Unreal Engine 5",
      status: "En cours",
    },
    {
      title: "Neon Shadows",
      description:
        "Infiltration dans une mégalopole cyberpunk saturée de néons.",
      engine: "Unity",
      status: "Terminé",
    },
    {
      title: "Cyber Rush",
      description: "Runner infini où la vitesse augmente à chaque seconde.",
      engine: "Godot",
      status: "En cours",
    },
  ];

  return (
    <main className="text-box">
      <hgroup className="block-primary">
        <h2 className="block-primary-main">Vidéogames</h2>
        <p className="block-primary-sub">voyez nos jeux</p>
      </hgroup>

      {/* SECTION DES CARTES */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          justifyContent: "center",
          flexWrap: "wrap",
          marginTop: "30px",
          marginBottom: "30px",
        }}
      >
        {fakeGames.map((game) => (
          <GameCard key={game.title} {...game} />
        ))}
      </div>

      <div style={{ marginTop: "70px" }}>
        <h2 style={{ color: "#313120" }}>"L'aventure commence ici."</h2>
        <p style={{ color: "#242219" }}>
          Chaque grand jeu a commencé par une simple idée...
        </p>
      </div>
    </main>
  );
}

// --- LOADER UTILISATEUR ---
const userLoader = async () => {
  try {
    const response = await fetch("http://localhost:3310/api/me", {
      credentials: "include",
    });
    if (response.status === 401) return null;
    if (!response.ok) return null;
    const data = await response.json();
    return data;
  } catch (error) {
    return null;
  }
};

// --- ROUTAGE ---
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    id: "root",
    loader: userLoader,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/infos",
        element: <InfosPage />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "connection",
        element: <Login />,
      },
      {
        path: "profile",
        element: <User />,
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
