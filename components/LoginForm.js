"use client";

import { useState } from "react";
import styles from "../styles/LoginForm.module.css";

export default function LoginForm({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically validate the credentials with your backend
    // For this example, we'll just simulate a successful login
    if (username === "khunsuek" && password === "krabi") {
      localStorage.setItem("isLoggedIn", "true");
      onLogin();
    }
  };

  return (
    <div className={styles.loginContainer}>
      <h1>Log In</h1>
      <form onSubmit={handleSubmit} className={styles.loginForm}>
        <input
          type="name"
          placeholder="Enter Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <div className={styles.passwordContainer}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={styles.togglePassword}
          >
            {showPassword ? "👁️" : "👁️‍🗨️"}
          </button>
        </div>
        <button type="submit" className={styles.loginButton}>
          Log In
        </button>
      </form>
    </div>
  );
}
