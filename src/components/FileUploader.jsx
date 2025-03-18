import React from "react";
import useDeviceStore from "./hooks/useDeviceStore";

const FileUploader = () => {
  const { setBlueprint } = useDeviceStore();

  const removeWhiteBackground = (img) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      if (data[i] > 240 && data[i + 1] > 240 && data[i + 2] > 240) {
        data[i + 3] = 0; // Set alpha to 0
      }
    }

    ctx.putImageData(imageData, 0, 0);
    const newImg = new window.Image();
    newImg.src = canvas.toDataURL();
    newImg.onload = () => setBlueprint(newImg);
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const img = new window.Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => removeWhiteBackground(img);
    }
  };

  return (
    <input
      type="file"
      onChange={handleUpload}
      style={{
        padding: "8px",
        border: "1px solid #ccc",
        borderRadius: "5px",
        cursor: "pointer",
      }}
    />
  );
};

export default FileUploader;