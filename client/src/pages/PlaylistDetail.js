import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";
import "../styles/main.css";
import AddSongToPlaylist from "./AddSongToPlaylist";
import { useAuth } from "../context/AuthContext";

const PlaylistDetail = () => {
  const { id } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [msg, setMsg] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchPlaylist = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/playlists/${id}`);
      setPlaylist(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch playlist details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaylist();
  }, [id]);

  const handleRemoveSong = async (songId) => {
    if (!window.confirm("Are you sure you want to remove this song?")) return;

    try {
      await api.delete(`/playlists/${id}/songs/${songId}`);
      setPlaylist({
        ...playlist,
        songs: playlist.songs.filter((s) => s.id !== songId),
      });
      setMsg("Song removed successfully!");
      setTimeout(() => setMsg(""), 3000);
    } catch (err) {
      console.error(err);
      setMsg("Failed to remove song");
      setTimeout(() => setMsg(""), 3000);
    }
  };

  if (loading) return <p>Loading playlist...</p>;
  if (error) return <p>{error}</p>;
  if (!playlist) return <p>Playlist not found</p>;

  const { name, description, songs } = playlist;

  return (
    <div className="page-container">
      <h1>{name}</h1>
      <p>{description || "No description available."}</p>

      {msg && <p className="success">{msg}</p>}

      <h3>Songs ({songs.length})</h3>
      {songs.length === 0 ? (
        <p>No songs in this playlist yet.</p>
      ) : (
        <ul className="song-list">
          {songs.map((song) => (
            <li key={song.id}>
              {song.title} - {song.artist}
              {user && (
                <button
                  className="remove-btn"
                  onClick={() => handleRemoveSong(song.id)}
                >
                  Remove
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
      
 {user && (
  <div className="add-song-section">
    <h3>Add Song to Playlist</h3>
    <AddSongToPlaylist
      playlistId={id}
      onSongAdded={(newSong) => {
        // Update playlist state immediately
        setPlaylist((prev) => ({
          ...prev,
          songs: [...prev.songs, {
            id: newSong.song.id,
            title: newSong.song.title,
            artist: newSong.song.artist,
            genre: newSong.song.genre,
            duration: newSong.song.duration,
            link: newSong.song.link
          }],
        }));

        // Show success message
        setMsg("Song added successfully!");
        setTimeout(() => setMsg(""), 3000);
      }}
    />
  </div>
)}
    </div>
  );
};

export default PlaylistDetail;
