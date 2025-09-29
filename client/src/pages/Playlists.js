import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import PlaylistCard from "../components/PlaylistCard";
import SearchBar from "../components/SearchBar";
import FilterDropdown from "../components/FilterDropdown";
import { useAuth } from "../context/AuthContext";
import "../styles/main.css";

const Playlists = () => {
  const [playlists, setPlaylists] = useState([]);
  const [filteredPlaylists, setFilteredPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

useEffect(() => {
  const fetchPlaylists = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await api.get("/playlists");
      console.log("Playlists fetched:", res.data); // Debug: check returned data
      setPlaylists(res.data);
      setFilteredPlaylists(res.data);
    } catch (err) {
      if (err.response) {
        // Backend returned a response with error status
        console.error("Backend error:", err.response.data);
        setError(
          `Backend error: ${err.response.status} - ${err.response.data.error || JSON.stringify(err.response.data)}`
        );
      } else if (err.request) {
        // Request made but no response received
        console.error("No response received:", err.request);
        setError("No response from server. Is the backend running?");
      } else {
        // Other errors
        console.error("Request setup error:", err.message);
        setError(`Error: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  fetchPlaylists();
}, []);

  // Filter playlists based on search and category
  useEffect(() => {
    let filtered = playlists;

    if (searchQuery) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (categoryFilter) {
      filtered = filtered.filter(
        (p) => p.category && p.category === categoryFilter
      );
    }

    setFilteredPlaylists(filtered);
  }, [searchQuery, categoryFilter, playlists]);

  const categories = [
    ...new Set(playlists.map((p) => p.category).filter(Boolean)),
  ];

const handleCreateClick = () => {
  if (user) {
    navigate("/create-playlist", {
      state: { onNewPlaylist: addPlaylistToList }
    });
  } else {
    navigate("/login");
  }
};

// Define the function to add a playlist
const addPlaylistToList = (newPlaylist) => {
  setPlaylists((prev) => [newPlaylist, ...prev]);
  setFilteredPlaylists((prev) => [newPlaylist, ...prev]);
};

  if (loading) {
    return (
      <div className="page-container">
        <h1>All Playlists</h1>
        <div className="grid">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="playlist-skeleton">
              <div className="skeleton-title"></div>
              <div className="skeleton-desc"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) return <p>{error}</p>;

  return (
    <div className="page-container">
      <h1>All Playlists</h1>

      <div className="search-filter">
        <SearchBar onSearch={setSearchQuery} />
        {categories.length > 0 ? (
          <FilterDropdown
            options={categories}
            selected={categoryFilter}
            onChange={setCategoryFilter}
          />
        ) : (
          <p>No categories available</p>
        )}
      </div>

      {filteredPlaylists.length === 0 ? (
        <p>No playlists found.</p>
      ) : (
        <div className="grid">
          {filteredPlaylists.map((playlist) => (
            <PlaylistCard
              key={playlist.id}
              playlist={playlist}
              description={playlist.description}
            />
          ))}
        </div>
      )}

      <button
        className="create-btn"
        onClick={handleCreateClick}
        aria-label="Create Playlist"
      >
        + Create Playlist
      </button>
    </div>
  );
};

export default Playlists;
