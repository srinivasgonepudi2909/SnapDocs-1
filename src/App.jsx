import React from "react";
import Header from "./components/Header.jsx";
import HomeIntro from "./pages/homeintro.jsx"; // match the lowercase file name

export default function App() {
  return (
    <>
      <Header />
      <HomeIntro />
    </>
  );
}
