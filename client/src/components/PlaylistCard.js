import React from "react";
import { Link } from "react-router-dom";
import "./PlaylistCard.css";

const PlaylistCard = ({ playlist }) => {
  const { id, name, description, songs = [] } = playlist;

  return (
    <div className="playlist-card">
      <Link to={`/playlists/${id}`} className="playlist-link">
        <h3>{name}</h3>
        {description && <p>{description}</p>}
        <p>{songs.length} {songs.length === 1 ? "song" : "songs"}</p>
      </Link>
    </div>
  );
};

export default PlaylistCard;
