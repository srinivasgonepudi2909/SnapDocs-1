import React from "react";
import Header from "./components/Header";
import Homepage from "./components/Homepage/Homepage"; // 👈 Import your homepage

export default function App() {
  return (
    <>
      <Header />
      <Homepage /> {/* 👈 This renders your logo + intro section */}
    </>
  );
}
