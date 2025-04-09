import Header from "./Header";
import "../styles/MovieList.css";
import VideoPlayer from "./VideoPlayer";
import CardSlider from "./CardSlider";
import { useEffect, useRef, useState } from "react";

const MovieList: React.FC = () => {
  const videoRef = useRef<HTMLDivElement>(null);
  const [videoHeight, setVideoHeight] = useState<number>(0);

  useEffect(() => {
    if (videoRef.current) {
      setVideoHeight(videoRef.current.offsetHeight);
    }
    // Update height on resize
    const handleResize = () => {
      if (videoRef.current) {
        setVideoHeight(videoRef.current.offsetHeight);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <div className="page-wrapper">
      {/* Header */}
      <div className="header-wrapper">
        <Header />
      </div>
      <main>
        {/* Video Player and Carousels */}
        <div className="element-container">
          {/* <div className="video-wrapper">
          <VideoPlayer />
        </div> */}
          <div
            className="slide-container"
            style={{ marginTop: `${videoHeight}px` }}
          >
            {" "}
            <CardSlider /> {/* First carousel */}
          </div>
          <div className="slide-container">
            <CardSlider /> {/* Second carousel */}
          </div>
        </div>
      </main>
    </div>
  );
};

export default MovieList;
