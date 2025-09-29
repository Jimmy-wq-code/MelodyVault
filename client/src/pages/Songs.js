import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";
import "../styles/main.css";
import AddSongToPlaylist from "../pages/AddSongToPlaylist";
import { useAuth } from "../context/AuthContext";

const Songs = () => {
  const [songs, setSongs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchSongs = async (query = "") => {
    setLoading(true);
    try {
      const res = await api.get("/songs", {
        params: { search: query, sort_by: "title" },
      });
      setSongs(res.data);
    } catch (err) {
      setError("Failed to fetch songs");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchSongs(search);
  };

  if (loading) {
    return (
      <div className="page-container">
        <h1>All Songs</h1>
        {[...Array(4)].map((_, i) => (
          <div key={i} className="song-skeleton">
            <div className="skeleton-title"></div>
            <div className="skeleton-text"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) return <p className="error">{error}</p>;

  return (
    <div className="page-container">
      <h1>All Songs</h1>

      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search by title or artist"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          Search
        </button>
      </form>

      {songs.length === 0 ? (
        <p>No songs found.</p>
      ) : (
        <ul className="song-list">
          {songs.map((song) => (
            <li key={song.id} className="song-item">
              <Link to={`/songs/${song.id}`}>
                {song.title} - {song.artist}
              </Link>
              {user && (
                <AddSongToPlaylist
                  songId={song.id}
                  onSongAdded={() => console.log(`${song.title} added to playlist`)}
                />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Songs;
