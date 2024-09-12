"use client";

import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import ProductList from "../components/ProductList";
import LoginForm from "../components/LoginForm";
import styles from "../styles/Layout.module.css";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn");
    if (loggedIn === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <Layout>
      {isLoggedIn ? (
        <>
          <header className={styles.header}>
            <h1>Khunsuek Muay Thai</h1>
          </header>
          <nav className={styles.mainNav}>
            <a href="#" className={styles.active}>
              Class
            </a>
            <a href="#">About Gym</a>
            <a href="#">Trainer</a>
            <a href="#">Facility & Equipment</a>
            <a href="#">Review</a>
          </nav>
          <ProductList />
        </>
      ) : (
        <>
          <div style={{ height: "100px" }}></div>

          <LoginForm onLogin={handleLogin} />
        </>
      )}
    </Layout>
  );
}
