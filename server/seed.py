#!/usr/bin/env python3

from random import choice, randint, sample
from datetime import datetime
from faker import Faker
from werkzeug.security import generate_password_hash
from app import app
from models import db, User, Playlist, Song, PlaylistSong

fake = Faker()

def format_duration(seconds):
    """Convert seconds to mm:ss string format."""
    return f"{seconds // 60}:{seconds % 60:02d}"

with app.app_context():
    print("Deleting old data...")
    PlaylistSong.query.delete(synchronize_session=False)
    Playlist.query.delete(synchronize_session=False)
    Song.query.delete(synchronize_session=False)
    User.query.delete(synchronize_session=False)
    db.session.commit()

    print("Seeding users...")
    users = [
        User(username="Jimmy Okwiri", email="jimmyokwiri@gmail.com", password_hash=generate_password_hash("password123")),
        User(username="Nico Kiama", email="nicoKiama@gmail.com", password_hash=generate_password_hash("mypassword")),
        User(username="Alice Sian", email="alicesian@gmail.com", password_hash=generate_password_hash("alicepass")),
    ]
    db.session.add_all(users)
    db.session.commit()

    print("Seeding songs (manual + fake)...")
    manual_songs = [
        Song(title="Blinding Lights", artist="The Weeknd", genre="Pop", duration=format_duration(200)),
        Song(title="Blindfold", artist="Gunna", genre="Trap", duration=format_duration(355)),
        Song(title="Shape of You", artist="Ed Sheeran", genre="Pop", duration=format_duration(240)),
    ]
    db.session.add_all(manual_songs)
    db.session.commit()

    fake_songs = [
        Song(
            title=fake.sentence(nb_words=3).replace(".", ""),
            artist=fake.name(),
            genre=choice(["Pop", "Rock", "Hip-Hop", "Jazz", "Trap"]),
            duration=format_duration(randint(120, 400)),
        )
        for _ in range(10)
    ]
    db.session.add_all(fake_songs)
    db.session.commit()

    all_songs = Song.query.all()  # Get all songs after adding them

    print("Seeding playlists (manual + fake)...")
    manual_playlists = [
        Playlist(
            name="Chill Vibes",
            description="Relaxing tracks for study sessions",
            user_id=users[0].id,
            likes=randint(0, 50),
        ),
        Playlist(
            name="Workout Hits",
            description="High energy songs for the gym",
            user_id=users[1].id,
            likes=randint(0, 50),
        ),
    ]
    db.session.add_all(manual_playlists)
    db.session.commit()

    fake_playlists = [
        Playlist(
            name=fake.catch_phrase(),
            description=fake.text(max_nb_chars=50),
            user_id=choice(users).id,
            likes=randint(0, 50),
        )
        for _ in range(5)
    ]
    db.session.add_all(fake_playlists)
    db.session.commit()

    all_playlists = Playlist.query.all()

    print("Assigning songs to playlists with notes, added_date, and likes...")
    playlist_songs = []

    for pl in all_playlists:
        # Assign 3–6 random songs to each playlist
        songs_for_playlist = sample(all_songs, k=randint(3, min(6, len(all_songs))))
        for song in songs_for_playlist:
            playlist_songs.append(
                PlaylistSong(
                    playlist_id=pl.id,
                    song_id=song.id,
                    note=fake.sentence(nb_words=6),
                    added_date=fake.date_time_between(start_date="-1y", end_date="now"),
                    likes=randint(0, 20),
                )
            )

    db.session.add_all(playlist_songs)
    db.session.commit()

    print("✅ Done seeding MelodyVault with users, songs, playlists, and realistic playlist-song assignments!")
