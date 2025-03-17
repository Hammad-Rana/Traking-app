import React from "react";
import useDeviceStore from "./hooks/useDeviceStore";

const FileUploader = () => {
  const { setBlueprint } = useDeviceStore();
  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const img = new window.Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => setBlueprint(img);
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