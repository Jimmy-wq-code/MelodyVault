import { useEffect, useState } from "react";
import api from "../api/api";

const AddSongToPlaylist = ({ songId, playlistId = null, onSongAdded }) => {
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(playlistId || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch playlists on mount
  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const res = await api.get("/playlists");
        setPlaylists(res.data);
        if (!playlistId && res.data.length > 0) {
          setSelectedPlaylist(res.data[0].id);
        }
      } catch (err) {
        console.error("Failed to fetch playlists:", err);
        setError("Failed to load playlists");
      }
    };
    fetchPlaylists();
  }, [playlistId]);

  const handleAddSong = async () => {
  if (!selectedPlaylist) {
    setError("Please select a playlist");
    return;
  }

  if (!window.confirm("Add this song to the selected playlist?")) return;

  setLoading(true);
  setError(null);

  try {
    const res = await api.post(
      `/playlists/${selectedPlaylist}/songs`,
      { song_id: songId }
    );

    // Return the newly added PlaylistSong
    if (onSongAdded) onSongAdded(res.data.playlist_song);

  } catch (err) {
    console.error("Failed to add song:", err);
    setError(
      err.response?.data?.error || "Failed to add song to playlist"
    );
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="add-song-container">
      {playlists.length > 0 ? (
        <>
          <select
            value={selectedPlaylist}
            onChange={(e) => setSelectedPlaylist(e.target.value)}
          >
            {playlists.map((playlist) => (
              <option key={playlist.id} value={playlist.id}>
                {playlist.name}
              </option>
            ))}
          </select>
          <button onClick={handleAddSong} disabled={loading}>
            {loading ? "Adding..." : "Add"}
          </button>
        </>
      ) : (
        <p>No playlists available. Create one first.</p>
      )}
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default AddSongToPlaylist;
