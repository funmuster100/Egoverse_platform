
import { useState } from "react";

export default function AvatarUpload({ onUpload }) {
  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
      localStorage.setItem("ego_avatar", reader.result);
      onUpload(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{ cursor: "pointer", color: "#00ff88" }}>
        Avatar hochladen
        <input
          type="file"
          accept="image/*"
          onChange={handleChange}
          style={{ display: "none" }}
        />
      </label>
      {image && (
        <img
          src={image}
          alt="avatar"
          style={{ width: 80, height: 80, borderRadius: "50%", marginTop: 10 }}
        />
      )}
    </div>
  );
}
