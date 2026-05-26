import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import FeedbackPage from "./pages/FeedbackPage";
import PhotosPage from "./pages/PhotosPage";
import MusicPage from "./pages/MusicPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/feedback"
          element={<FeedbackPage />}
        />

        <Route
          path="/fotos"
          element={<PhotosPage />}
        />

        <Route
          path="/musicas"
          element={<MusicPage />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;