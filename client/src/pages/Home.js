import "../styles/main.css";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import PlaylistCard from "../components/PlaylistCard";
import SearchBar from "../components/SearchBar";
import FilterDropdown from "../components/FilterDropdown";
import AddSongToPlaylist from "../pages/AddSongToPlaylist";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const [playlists, setPlaylists] = useState([]);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [genreFilter, setGenreFilter] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [playlistsRes, songsRes] = await Promise.all([
          api.get("/playlists"),
          api.get("/songs"),
        ]);
        setPlaylists(playlistsRes.data);
        setSongs(songsRes.data);
      } catch {
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredSongs = songs.filter((song) =>
    (song.title + song.artist)
      .toLowerCase()
      .includes(searchQuery.toLowerCase()) &&
    (genreFilter ? song.genre === genreFilter : true)
  );

  const genres = [...new Set(songs.map((s) => s.genre).filter(Boolean))];

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="home-container">
      <h1>Welcome to MelodyVault</h1>

      {/* Search & Filter */}
      <div className="search-filter">
        <SearchBar onSearch={setSearchQuery} />
        {genres.length > 0 && (
          <FilterDropdown
            options={genres}
            selected={genreFilter}
            onChange={setGenreFilter}
          />
        )}
      </div>

      {/* Songs */}
      <h2>All Songs</h2>
      {filteredSongs.length === 0 ? (
        <p>No songs found.</p>
      ) : (
        <ul className="song-list">
          {filteredSongs.map((song) => (
            <li key={song.id}>
              <strong>{song.title}</strong> by {song.artist}{" "}
              {user ? (
                <AddSongToPlaylist songId={song.id} />
              ) : (
                <button onClick={() => navigate("/login")}>Add</button>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Playlists */}
      <h2>All Playlists</h2>
      {playlists.length === 0 ? (
        <p>No playlists available. Create one!</p>
      ) : (
        <div className="grid">
          {playlists.map((pl) => (
            <PlaylistCard key={pl.id} playlist={pl} />
          ))}
        </div>
      )}

      {/* Create Playlist Button */}
      {user ? (
        <Link to="/create-playlist" className="create-btn">
          + Create New Playlist
        </Link>
      ) : (
        <button className="create-btn" onClick={() => navigate("/login")}>
          + Create New Playlist
        </button>
      )}
    </div>
  );
};

export default Home;
