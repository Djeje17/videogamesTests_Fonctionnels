CREATE DATABASE IF NOT EXISTS videogames;
USE videogames;

-- Table des utilisateurs
CREATE TABLE user (
  id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
  username VARCHAR(250) NOT NULL UNIQUE,
  email VARCHAR(250) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Table des jeux
CREATE TABLE game (
  id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
  title VARCHAR(150) NOT NULL,
  description TEXT NOT NULL,
  engine VARCHAR(100),
  status ENUM('en cours', 'terminé', 'en pause') DEFAULT 'en cours',
  user_id INT NOT NULL,
  CONSTRAINT fk_game_user FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);

-- Table des tâches
CREATE TABLE task (
  id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
  label VARCHAR(250) NOT NULL,
  category ENUM('code', 'art', 'design', 'son', 'autre') DEFAULT 'code',
  priority INT DEFAULT 1,
  game_id INT NOT NULL,
  CONSTRAINT fk_task_game FOREIGN KEY (game_id) REFERENCES game(id) ON DELETE CASCADE
);

