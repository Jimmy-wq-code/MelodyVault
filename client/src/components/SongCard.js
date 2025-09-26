import React from "react";

const SongCard = ({ song }) => {
  const { title, artist, genre } = song;

  return (
    <div className="card">
      <h4>{title}</h4>
      <p>Artist: {artist}</p>
      {genre && <p>Genre: {genre}</p>}
    </div>
  );
};

export default SongCard;
