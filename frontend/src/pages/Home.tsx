import { useEffect, useState } from "react";
import HomeHeader from "../components/HomeHeader";
import "../styles/MovieList.css";
import HomeVideoPlayer from "../components/HomeVideoPlayer";
import CardSlider from "../components/CardSlider"; // Import the new component

function Home() {
  return (
    <div
      style={{
        width: "100vw",
        minHeight: "100vh",
        overflowY: "auto",
        backgroundColor: "#141414",
        color: "white",
        position: "relative",
      }}
    >
      {/* Sticky Header */}
      <div style={{ position: "sticky", top: 0, zIndex: 20 }}>
        <HomeHeader />
      </div>

      {/* Video Section */}
      <div
        style={{
          padding: "2rem 1rem",
          backgroundColor: "transparent",
          zIndex: 1,
        }}
      >
        <HomeVideoPlayer />
      </div>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />

      {/* Card Slider Section */}
      <div style={{ marginTop: "35rem" }}>
        <CardSlider />
      </div>
    </div>
  );
}

export default Home;
