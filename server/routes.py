from config import app, api
from resources import Users, UserById, Playlists, PlaylistById, Songs, SongById, PlaylistSongAdd, PlaylistSongRemove
from flask import request
from models import User

# Login route (Flask route)
@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return {"error": "Email and password required"}, 400

    user = User.query.filter_by(email=email).first()
    if user and user.check_password(password):
        return user.to_dict(), 200
    else:
        return {"error": "Invalid email or password"}, 401


# User routes
api.add_resource(Users, "/users")
api.add_resource(UserById, "/users/<int:id>")

# Playlist routes
api.add_resource(Playlists, "/playlists")
api.add_resource(PlaylistById, "/playlists/<int:id>")
api.add_resource(PlaylistSongRemove, "/playlists/<int:playlist_id>/songs/<int:song_id>")
api.add_resource(PlaylistSongAdd, "/playlists/<int:playlist_id>/songs")

# Song routes
api.add_resource(Songs, "/songs")
api.add_resource(SongById, "/songs/<int:id>")
