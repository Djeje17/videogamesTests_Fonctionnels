import { useState } from "react";
import "./connection.css";
//import { useNavigate } from "react-router-dom";
interface IInitialValue {
  email: string;
  password: string;
}

export default function Login() {
  //const navigate = useNavigate();
  const [initialValue, setinitialValue] = useState<IInitialValue>({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  // get input value
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setinitialValue({
      ...initialValue,
      [name]: value,
    });
    setMessage("");
  };
  // Submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // On envoie les infos au serveur (port 3310)
      const response = await fetch("http://localhost:3310/api/connection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(initialValue),
        credentials: "include",
      });

      if (response.ok) {
        const user = await response.json();
        window.location.href = "/profile";
        setMessage(`Welcome ${user.username} !`);

        // Optionnel : stocker le nom de l'utilisateur pour le Header
        // localStorage.setItem("isLoggedIn", "true");

        setinitialValue({ email: "", password: "" });
      } else {
        setMessage("Email ou mot de passe incorrect.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Erreur de connexion au serveur.");
    }
  };
  return (
    <main>
      <h3>Veuillez vous connecter</h3>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={initialValue.email}
          onChange={handleChange}
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={initialValue.password}
          onChange={handleChange}
        />
        <span>{message}</span>
        <button type="submit">login</button>
      </form>
    </main>
  );
}
