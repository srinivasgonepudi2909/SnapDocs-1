import React from "react";
import Header from "./components/Header.jsx";
import HomeIntro from "./pages/HomeIntro"; // ✅ matches lowercase filename

export default function App() {
  return (
    <>
      <Header />
      <HomeIntro />
    </>
  );
}
