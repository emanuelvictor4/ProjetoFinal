import { useState } from "react";
import './App.css'
import PunkGallery from "./components/PunkGallery";
import SpotifyGallery from "./components/SpotifyGallery";
import Auth from "./components/Auth";
import Feedback from "./components/Feedback";

function App() {
  
  const [user, setUser] = useState(null);

  if (!user) return <Auth onLogin={setUser} />;

  return <Feedback user={user} onLogout={() => setUser(null)} />;

}

export default App