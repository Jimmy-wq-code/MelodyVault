from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from datetime import datetime
from config import db
from werkzeug.security import generate_password_hash, check_password_hash

# User Model
class User(db.Model, SerializerMixin):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)

    # Relationships
    playlists = db.relationship(
        "Playlist", back_populates="user", cascade="all, delete-orphan"
    )

    serialize_rules = ("-playlists.user",)
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
        }

    def __repr__(self):
        return f"<User {self.username}>"


# Playlist Model
class Playlist(db.Model, SerializerMixin):
    __tablename__ = "playlists"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    description = db.Column(db.String)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))

    # Likes for the playlist
    likes = db.Column(db.Integer, default=0)

    # Relationships
    user = db.relationship("User", back_populates="playlists")
    playlist_songs = db.relationship(
        "PlaylistSong", back_populates="playlist", cascade="all, delete-orphan"
    )
    songs = association_proxy("playlist_songs", "song")

    serialize_rules = ("-user.playlists", "-playlist_songs.playlist")

    def to_dict_with_songs(self):
        base = self.to_dict()
        base["songs"] = [
            {
                **ps.song.to_dict(),
                "note": ps.note,
                "added_date": ps.added_date.isoformat() if ps.added_date else None,
                "likes": getattr(ps, "likes", 0),
            }
            for ps in self.playlist_songs
        ]
        return base

    def __repr__(self):
        return f"<Playlist {self.name}>"

# Song Model
class Song(db.Model, SerializerMixin):
    __tablename__ = "songs"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)
    artist = db.Column(db.String, nullable=False)
    genre = db.Column(db.String)
    duration = db.Column(db.String) 
    link = db.Column(db.String)     

    # Relationships
    playlist_songs = db.relationship(
        "PlaylistSong", back_populates="song", cascade="all, delete-orphan"
    )
    playlists = association_proxy("playlist_songs", "playlist")

    serialize_rules = ("-playlist_songs.song",)

    def to_dict_with_playlists(self):
        base = self.to_dict()
        base["playlists"] = [
            {
                **ps.playlist.to_dict(),
                "note": ps.note,
                "added_date": ps.added_date.isoformat() if ps.added_date else None,
                "likes": getattr(ps, "likes", 0),
            }
            for ps in self.playlist_songs
        ]
        return base

    def __repr__(self):
        return f"<Song {self.title} by {self.artist}>"

# PlaylistSong Model (Association Table with Extra Fields)
class PlaylistSong(db.Model, SerializerMixin):
    __tablename__ = "playlist_songs"

    id = db.Column(db.Integer, primary_key=True)
    playlist_id = db.Column(db.Integer, db.ForeignKey("playlists.id"))
    song_id = db.Column(db.Integer, db.ForeignKey("songs.id"))

    note = db.Column(db.String)  # user-submittable note
    added_date = db.Column(db.DateTime, default=datetime.utcnow)
    likes = db.Column(db.Integer, default=0)

    # Relationships
    playlist = db.relationship("Playlist", back_populates="playlist_songs")
    song = db.relationship("Song", back_populates="playlist_songs")

    serialize_rules = ("-playlist.playlist_songs", "-song.playlist_songs")

    def __repr__(self):
        return f"<PlaylistSong Playlist={self.playlist_id} Song={self.song_id}>"
