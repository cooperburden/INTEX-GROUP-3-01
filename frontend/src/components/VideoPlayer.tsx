const VideoPlayer = () => {
  return (
    <div
      style={{
        position: "relative",
        // top: 0,
        // left: 0,
        width: "100%",
        height: "400vh", // Video takes top 90% (matches your layout)
        overflow: "hidden",
        zIndex: 20, // Below cards
        background: "#000",
      }}
    >
      <video
        autoPlay
        loop
        muted
        playsInline
        disablePictureInPicture
        controls={false}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          pointerEvents: "none",
          display: "block",
        }}
      >
        <source src="/video/vid1.mp4" type="video/mp4" />
        Video not supported
      </video>

      {/* Grey overlay from VideoHero */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.4)", // Grey overlay
          zIndex: 11, // Above video, below text
        }}
      />

      {/* Text + Button from VideoHero */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 2, // Above overlay
          textAlign: "center",
          color: "white",
        }}
      >
        <h1
          style={{
            fontSize: "4rem",
            fontWeight: "800",
            marginBottom: "1.5rem",
            letterSpacing: "-0.5px",
            lineHeight: "1.1",
          }}
        >
          Lights. Camera. Stream.
        </h1>
        <button
          style={{
            padding: "0.75rem 1.5rem",
            fontSize: "1.2rem",
            backgroundColor: "red",
            border: "none",
            borderRadius: "5px",
            color: "white",
            cursor: "pointer",
          }}
          onClick={() =>
            window.scrollTo({ top: window.innerHeight, behavior: "smooth" })
          }
        >
          Browse
        </button>
      </div>

      {/* Gradient overlay for greyed-out effect from VideoPlayer */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "200px", // Height of fade (adjustable)
          background:
            "linear-gradient(to top, rgba(128, 128, 128, 0.8), transparent)",
          pointerEvents: "none",
          zIndex: 11, // Same level as grey overlay
        }}
      />
    </div>
  );
};

export default VideoPlayer;
