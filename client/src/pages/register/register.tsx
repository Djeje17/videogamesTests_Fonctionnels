import { useState } from "react";
import "./register.css";
import { useNavigate } from "react-router-dom";

interface IFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<IFormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setMessage("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      // 1. Appel au backend avec fetch
      const response = await fetch("http://localhost:3310/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });

      if (response.ok) {
        setMessage("Inscription réussie ! Redirection vers la connexion...");

        // Réinitialisation du formulaire
        setFormData({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
        });

        // 2. Redirection vers la page de LOGIN après 2 secondes
        setTimeout(() => {
          navigate("/connection");
        }, 2000);
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || "Une erreur est survenue.");
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi :", error);
      setMessage("Impossible de contacter le serveur.");
    }
  };

  return (
    <main className="register-container">
      <h3>Créez un compte</h3>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        />

        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <label htmlFor="confirm-password">Confirm Password</label>
        <input
          type="password"
          id="confirm-password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />

        {message && <span className="error-message">{message}</span>}
        <button type="submit">S'inscrire</button>
      </form>
    </main>
  );
}
