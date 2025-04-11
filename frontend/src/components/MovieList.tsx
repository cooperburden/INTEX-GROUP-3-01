import Header from "./Header";
import "../styles/MovieList.css";
import VideoPlayer from "./VideoPlayer";

import CardSliderRec from "./CardSliderRec";
import Footer from "./Footer";



function MovieList() {
  return (
    <>
      <div className="page-wrapper">
        {/* Header */}
        <div className="header-wrapper">
          <Header />
        </div>
        {/* Video Player and Carousels */}
        <div className="element-container">
          <div className="video-wrapper">
            <VideoPlayer />
          </div>
          <div className="slide-container">
            <CardSliderRec recType="top_all" /> {/* First carousel */}
          </div>
          <div className="slide-container">
            <CardSliderRec recType="top_genre" /> {/* Second carousel */}
          </div>
          <div className="slide-container">
            <CardSliderRec recType="second_genre" /> {/* Third carousel */}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default MovieList;
