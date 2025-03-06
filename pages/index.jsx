// pages/index.js
import { useState, useRef } from "react";

const density = "Ñ@#W$9876543210?!abc;:+=-,._          ";

export default function Home() {
  const [asciiArt, setAsciiArt] = useState("");
  const [uploadedImage, setUploadedImage] = useState(null);
  const canvasRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setUploadedImage(event.target.result);
      setAsciiArt(""); // reset previous result
    };
    reader.readAsDataURL(file);
  };

  const convertToAscii = () => {
    if (!uploadedImage) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.src = uploadedImage;
    img.onload = () => {
      const targetWidth = 100; // adjust resolution here
      const scale = targetWidth / img.width;
      const targetHeight = Math.floor(img.height * scale);
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
      const { data } = ctx.getImageData(0, 0, targetWidth, targetHeight);
      let ascii = "";
      for (let y = 0; y < targetHeight; y++) {
        for (let x = 0; x < targetWidth; x++) {
          const offset = (y * targetWidth + x) * 4;
          const r = data[offset];
          const g = data[offset + 1];
          const b = data[offset + 2];
          const avg = (r + g + b) / 3;
          const charIndex = Math.floor((avg / 255) * (density.length - 1));
          ascii += density.charAt(charIndex);
        }
        ascii += "\n";
      }
      setAsciiArt(ascii);
    };
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Pixel Art Generator</h1>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {uploadedImage && (
        <div style={{ marginTop: "1rem" }}>
          <img
            src={uploadedImage}
            alt="Uploaded"
            style={{ maxWidth: "100%", height: "auto" }}
          />
          <div>
            <button onClick={convertToAscii} style={{ marginTop: "1rem" }}>
              Generate ASCII Art
            </button>
          </div>
        </div>
      )}
      {/* Hidden canvas used for image processing */}
      <canvas ref={canvasRef} style={{ display: "none" }} />
      {asciiArt && (
        <pre
          style={{
            fontFamily: "monospace",
            whiteSpace: "pre-wrap",
            background: "#000",
            color: "#fff",
            padding: "1rem",
            marginTop: "1rem",
          }}
        >
          {asciiArt}
        </pre>
      )}
    </div>
  );
}
