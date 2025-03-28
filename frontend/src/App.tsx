// ImageUpload.jsx
import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);

  const handleUpload = async () => {
    if (!image) {
      alert("Pilih gambar terlebih dahulu!");
      return;
    }
  
    const formData = new FormData();
    formData.append("image", image);
  
    try {
      const response = await fetch("https://simajukuybackend.vercel.app/analisis", {
        method: "POST",
        body: formData, // Jangan set Content-Type secara manual
      });
  
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error saat mengunggah:", error);
    }
  };  

  return (
    <div>
      <h2>Upload Gambar</h2>
      <input type="file" onChange={e => setImage(e.target.files[0])} />
      <button onClick={handleUpload}>Kirim & Analisa</button>

      {result && (
        <div>
          <p><strong>Hasil:</strong> {result.result ? 'True' : 'False'}</p>
          <p><strong>Catatan:</strong> {result.catatan}</p>
        </div>
      )}
    </div>
  );
};

export default App;