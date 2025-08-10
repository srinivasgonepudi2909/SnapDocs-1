import React from "react";
import Header from "./components/Header";
import HomePage from "./components/HomePage/HomePage"; // 👈 Import your homepage

export default function App() {
  return (
    <>
      <Header />
      <HomePage /> {/* 👈 This renders your logo + intro section */}
    </>
  );
}
