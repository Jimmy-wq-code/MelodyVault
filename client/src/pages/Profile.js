import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/api";
import "../styles/main.css";

const Profile = () => {
  const { user } = useAuth();
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      const fetchPlaylists = async () => {
        setLoading(true);
        try {
          const res = await api.get("/playlists");
          setPlaylists(res.data.filter((p) => p.user_id === user.id));
        } catch (err) {
          console.error(err);
          setError("Failed to load your playlists.");
        } finally {
          setLoading(false);
        }
      };
      fetchPlaylists();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (!user) return <p>Please log in to see your profile.</p>;
  if (loading) return <p>Loading your playlists...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="page-container profile">
      <h2>{user.username}'s Profile</h2>
      <p>Email: {user.email}</p>

      <h3>Your Playlists:</h3>
      {playlists.length === 0 ? (
        <p>You haven't created any playlists yet.</p>
      ) : (
        <ul>
          {playlists.map((pl) => (
            <li key={pl.id}>{pl.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Profile;
