// src/components/PlaylistCard.js
import React from "react";
import { Link } from "react-router-dom";
import "../styles/main.css";

const PlaylistCard = ({ playlist, description }) => {
  // Safely calculate song count
  const songCount = Array.isArray(playlist.songs) ? playlist.songs.length : 0;

  return (
    <div className="playlist-card">
      <Link to={`/playlists/${playlist.id}`} className="playlist-link">
        <h2>{playlist.name}</h2>
      </Link>
      {description && <p>{description}</p>}
      <p className="song-count">{songCount} {songCount === 1 ? "song" : "songs"}</p>
    </div>
  );
};

export default PlaylistCard;
