// ImageUpload.jsx
<<<<<<< HEAD
import { useState } from 'react';
=======
// import { useState } from 'react';
// import axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Community from "./pages/Community";
>>>>>>> d27869b (Add HomePage & Community v1.0)

const App = () => {
  // const [image, setImage] = useState(null);
  // const [result, setResult] = useState(null);

  // const handleUpload = async () => {
  //   if (!image) {
  //     alert("Pilih gambar terlebih dahulu!");
  //     return;
  //   }
  
  //   const formData = new FormData();
  //   formData.append("image", image);
  
<<<<<<< HEAD
    try {
      const response = await fetch("http://localhost:5000/analisis", {
        method: "POST",
        body: formData, // Jangan set Content-Type secara manual
      });
  
      const data = await response.json();
      setResult(data);
      console.log(response)
      console.log(data)
    } catch (error) {
      console.error("Error saat mengunggah:", error);
    }
  };  
=======
  //   try {
  //     const response = await fetch("https://simajukuybackend.vercel.app/analisis", {
  //       method: "POST",
  //       body: formData, // Jangan set Content-Type secara manual
  //     });
  
  //     const data = await response.json();
  //     setResult(data);
  //   } catch (error) {
  //     console.error("Error saat mengunggah:", error);
  //   }
  // };  
>>>>>>> d27869b (Add HomePage & Community v1.0)

  // return (
  //   <div>
  //     <h2>Upload Gambar</h2>
  //     <input type="file" onChange={e => setImage(e.target.files[0])} />
  //     <button onClick={handleUpload}>Kirim & Analisa</button>

  //     {result && (
  //       <div>
  //         <p><strong>Hasil:</strong> {result.result ? 'True' : 'False'}</p>
  //         <p><strong>Catatan:</strong> {result.catatan}</p>
  //       </div>
  //     )}
  //   </div>
  // );
  return (
<<<<<<< HEAD
    <div>
      <h2>Upload Gambar</h2>
      <input type="file" onChange={e => setImage(e?.target?.files?[0])} />
      <button onClick={handleUpload}>Kirim & Analisa</button>

      {result && (
        <div>
          <p><strong>Hasil:</strong> {result ? 'True' : 'False'}</p>
          <p><strong>Catatan:</strong> {result}</p>
        </div>
      )}
    </div>
  );
=======
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/komunitas" element={<Community />} />
      </Routes>
    </Router>
  )
>>>>>>> d27869b (Add HomePage & Community v1.0)
};

export default App;