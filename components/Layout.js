import styles from "../styles/Layout.module.css";

import { useState, useEffect } from "react";

export default function Layout({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn");
    if (loggedIn === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <div className={styles.container}>
      {/* {isLoggedIn ? (
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
        </>
      ) : (
        <div style={{ height: "100px" }}></div>
      )} */}
      <main>{children}</main>
    </div>
  );
}
