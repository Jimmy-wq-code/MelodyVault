import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Components
import NavBar from "./components/NavBar";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import Playlists from "./pages/Playlists";
import PlaylistDetail from "./pages/PlaylistDetail";
import Songs from "./pages/Songs";
import SongDetail from "./pages/SongDetail";
import CreatePlaylist from "./pages/CreatePlaylist";


// Private Route Component
const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/playlists/:id" element={<PrivateRoute><PlaylistDetail /></PrivateRoute>} />
          <Route path="/playlists" element={<Playlists />} />
          <Route path="/songs/:id" element={<PrivateRoute><SongDetail /></PrivateRoute>} />
          <Route path="/songs" element={<Songs />} />
          <Route path="/create-playlist" element={<PrivateRoute><CreatePlaylist /></PrivateRoute>}/>

          <Route path="*" element={
            <div className="not-found">
              <h1>404 - Page Not Found</h1>
              <a href="/" className="button-home">Go Home</a>
            </div>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
