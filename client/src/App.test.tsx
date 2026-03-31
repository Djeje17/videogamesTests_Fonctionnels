import { render, screen } from "@testing-library/react";
import App from "./App";

test("Vérifie que l'application se charge", async () => {
  render(<App />);

  // 1. Pour débugger : cette ligne va afficher le HTML généré dans ta console
  // screen.debug();

  // 2. On utilise 'findBy' au lieu de 'getBy'.
  // 'findBy' attend (jusqu'à 1s par défaut) que l'élément apparaisse.
  // Remplace "Bienvenue" par un mot qui est VRAIMENT sur ta page d'accueil (ex: "Connexion", "Login", etc.)
  const element = await screen.findByText(/videogames/i);

  expect(element).toBeInTheDocument();
});
