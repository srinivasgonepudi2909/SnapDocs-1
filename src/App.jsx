import React from "react";
import Header from "./components/Header";
import Homepage from "./components/Homepage/Homepage"; // ✅ Default export

export default function App() {
  return (
    <>
      <Header />
      <Homepage /> {/* ✅ Renders logo + intro section */}
    </>
  );
}
