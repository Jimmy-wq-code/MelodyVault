import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import api from "../api/api";
import "../styles/main.css";

const SongDetail = () => {
  const { id } = useParams();
  const [song, setSong] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSong = async () => {
      try {
        const res = await api.get(`/songs/${id}`);
        setSong(res.data);
      } catch (err) {
        setError("Failed to fetch song details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSong();
  }, [id]);

  if (loading) {
    return (
      <div className="page-container">
        <div className="skeleton-title"></div>
        <div className="skeleton-text"></div>
        <div className="skeleton-text"></div>
      </div>
    );
  }

  if (error) return <p className="error">{error}</p>;
  if (!song) return <p>Song not found</p>;

  return (
    <div className="page-container">
      <h1>{song.title}</h1>
      <p>
        <strong>Artist:</strong> {song.artist}
      </p>
      {song.genre && (
        <p>
          <strong>Genre:</strong> {song.genre}
        </p>
      )}
      {song.duration && (
        <p>
          <strong>Duration:</strong> {song.duration} mins
        </p>
      )}
      {song.link && (
        <p>
          <a href={song.link} target="_blank" rel="noopener noreferrer">
            Listen / Preview
          </a>
        </p>
      )}

      <h3>Playlists containing this song:</h3>
      {song.playlists && song.playlists.length > 0 ? (
        <ul className="playlist-list">
          {song.playlists.map((pl) => (
            <li key={pl.id}>
              <Link to={`/playlists/${pl.id}`}>{pl.name}</Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>This song is not in any playlist yet.</p>
      )}
    </div>
  );
};

export default SongDetail;
