from flask_restful import Resource
from flask import request
from models import User, Playlist, Song, PlaylistSong, db
from werkzeug.exceptions import NotFound, BadRequest
from datetime import datetime
from werkzeug.security import generate_password_hash
from sqlalchemy.orm import joinedload

class Users(Resource):
    def get(self):
        # Exclude passwords from output
        return [u.to_dict() for u in User.query.all()], 200

    def post(self):
        data = request.get_json()
        username = data.get("username")
        email = data.get("email")
        password = data.get("password")

        if not username or not email or not password:
            raise BadRequest("Username, Email, and Password are required")

        if User.query.filter_by(email=email).first():
            raise BadRequest("Email already exists")

        # Create new user and hash the password
        new_user = User(username=username, email=email)
        new_user.set_password(password)  # uses User method to hash password

        db.session.add(new_user)
        db.session.commit()
        return new_user.to_dict(), 201


class UserById(Resource):
    def get(self, id):
        user = User.query.get(id)
        if not user:
            raise NotFound("User not found")
        return user.to_dict(), 200
    def patch(self, id):
        user = User.query.get(id)
        if not user:
            raise NotFound("User not found")
        data = request.get_json()
        for attr in ["username", "email"]:
            if attr in data:
                if attr == "email" and User.query.filter_by(email=data["email"]).first():
                    raise BadRequest("Email already exists")
                setattr(user, attr, data[attr])
        db.session.commit()
        return user.to_dict(), 200
    def delete(self, id):
        user = User.query.get(id)
        if not user:
            raise NotFound("User not found")
        db.session.delete(user)
        db.session.commit()
        return '', 204

class Playlists(Resource):
    def get(self):
        try:
            playlists = Playlist.query.options(
                joinedload(Playlist.playlist_songs).joinedload(PlaylistSong.song)
            ).all()

            return [p.to_dict_with_songs() for p in playlists], 200

        except Exception as e:
            print("Error fetching playlists:", e)
            import traceback
            traceback.print_exc()
            return {"error": "Failed to fetch playlists"}, 500

    def post(self, playlist_id):
        data = request.get_json()
        song_id = data.get("song_id")
        if not song_id:
            return {"error": "song_id is required"}, 400

        playlist = Playlist.query.get(playlist_id)
        song = Song.query.get(song_id)
        if not playlist or not song:
            return {"error": "Playlist or Song not found"}, 404

        # Check if already added
        existing = PlaylistSong.query.filter_by(
            playlist_id=playlist_id, song_id=song_id
        ).first()
        if existing:
            return {"error": "Song already in playlist"}, 400

        ps = PlaylistSong(playlist=playlist, song=song)
        db.session.add(ps)
        db.session.commit()

        return ps.to_dict(), 201

class PlaylistById(Resource):
    def get(self, id):
        playlist = Playlist.query.get(id)
        if not playlist:
            raise NotFound("Playlist not found")
        artist_filter = request.args.get("artist")
        genre_filter = request.args.get("genre")
        sort_by = request.args.get("sort_by")  # "title", "added_date"
        songs_list = playlist.playlist_songs
        if artist_filter:
            songs_list = [ps for ps in songs_list if ps.song.artist.lower() == artist_filter.lower()]
        if genre_filter:
            songs_list = [ps for ps in songs_list if ps.song.genre.lower() == genre_filter.lower()]
        if sort_by:
            if sort_by == "title":
                songs_list.sort(key=lambda ps: ps.song.title.lower())
            elif sort_by == "added_date":
                songs_list.sort(key=lambda ps: ps.added_date or datetime.min)
        result = playlist.to_dict()
        result["likes"] = getattr(playlist, "likes", 0)
        result["songs"] = [
            {
                **ps.song.to_dict(),
                "note": ps.note,
                "added_date": ps.added_date.isoformat() if ps.added_date else None,
                "likes": getattr(ps, "likes", 0)
            }
            for ps in songs_list
        ]
        return result, 200
    def patch(self, id):
        playlist = Playlist.query.get(id)
        if not playlist:
            raise NotFound("Playlist not found")
        data = request.get_json()
        for attr in ["name", "description"]:
            if attr in data:
                setattr(playlist, attr, data[attr])
        db.session.commit()
        return playlist.to_dict(), 200
    def delete(self, id):
        playlist = Playlist.query.get(id)
        if not playlist:
            raise NotFound("Playlist not found")
        db.session.delete(playlist)
        db.session.commit()
        return {"message": f"Playlist {id} deleted"}, 204

class PlaylistSongAdd(Resource):
    def post(self, playlist_id):
        data = request.get_json()
        song_id = data.get("song_id")
        if not song_id:
            return {"error": "song_id is required"}, 400

        playlist = Playlist.query.get(playlist_id)
        song = Song.query.get(song_id)
        if not playlist or not song:
            return {"error": "Playlist or song not found"}, 404

        # Prevent duplicate
        existing = PlaylistSong.query.filter_by(
            playlist_id=playlist.id, song_id=song.id
        ).first()
        if existing:
            return {"error": "Song already in playlist"}, 400

        ps = PlaylistSong(playlist_id=playlist.id, song_id=song.id)
        db.session.add(ps)
        db.session.commit()

        return {"message": "Song added to playlist","playlist_song": { "id": playlist_song.id, "song": song.to_dict(), "note": playlist_song.note, "added_date": playlist_song.added_date.isoformat(), "likes": playlist_song.likes}}, 201

class PlaylistSongRemove(Resource):
    def delete(self, playlist_id, song_id):
        ps = PlaylistSong.query.filter_by(playlist_id=playlist_id, song_id=song_id).first()
        if not ps:
            raise NotFound("Song not found in this playlist")
        db.session.delete(ps)
        db.session.commit()
        return {"message": f"Song {song_id} removed from playlist {playlist_id}"}, 204

class Songs(Resource):
    def get(self):
        return [s.to_dict() for s in Song.query.all()], 200
    def post(self):
        data = request.get_json()
        if not data.get("title") or not data.get("artist"):
            raise BadRequest("Song must have title and artist")
        new_song = Song(
            title=data["title"],
            artist=data["artist"],
            genre=data.get("genre"),
            duration=data.get("duration"),
            link=data.get("link")
        )
        db.session.add(new_song)
        db.session.commit()
        return new_song.to_dict(), 201

class SongById(Resource):
    def get(self, id):
        song = Song.query.get(id)
        if not song:
            raise NotFound("Song not found")
        return song.to_dict_with_playlists(), 200
    def patch(self, id):
        song = Song.query.get(id)
        if not song:
            raise NotFound("Song not found")
        data = request.get_json()
        for attr in ["title", "artist", "genre", "duration", "link"]:
            if attr in data:
                setattr(song, attr, data[attr])
        db.session.commit()
        return song.to_dict(), 200
    def delete(self, id):
        song = Song.query.get(id)
        if not song:
            raise NotFound("Song not found")
        db.session.delete(song)
        db.session.commit()
        return '', 204

class Login(Resource):
    def post(self):
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            return {"message": "Email and password are required"}, 400

        user = User.query.filter_by(email=email).first()
        if not user or not user.check_password(password):
            return {"message": "Invalid email or password"}, 401

        return user.to_dict(), 200
