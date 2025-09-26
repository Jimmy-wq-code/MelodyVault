#!/usr/bin/env python3

from random import choice, randint
from datetime import datetime
from faker import Faker
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
        User(username="Jimmy Okwiri", email="jimmyokwiri@gmail.com"),
        User(username="Nico Kiama", email="nicoKiama@gmail.com"),
        User(username="Alice Sian", email="alicesian@gmail.com"),
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

    fake_songs = []
    for _ in range(10):
        fake_songs.append(
            Song(
                title=fake.sentence(nb_words=3).replace(".", ""),
                artist=fake.name(),
                genre=choice(["Pop", "Rock", "Hip-Hop", "Jazz", "Trap"]),
                duration=format_duration(randint(120, 400)),
            )
        )
    db.session.add_all(fake_songs)
    db.session.commit()

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

    fake_playlists = []
    for _ in range(5):
        fake_playlists.append(
            Playlist(
                name=fake.catch_phrase(),
                description=fake.text(max_nb_chars=50),
                user_id=choice(users).id,
                likes=randint(0, 50),
            )
        )
    db.session.add_all(fake_playlists)
    db.session.commit()

    print("Seeding playlist songs (with notes + added_date + likes)...")
    all_playlists = Playlist.query.all()
    all_songs = Song.query.all()

    playlist_songs = []
    used_pairs = set()
    for _ in range(15):
        pl = choice(all_playlists)
        song = choice(all_songs)
        # Avoid duplicate playlist-song pairs
        while (pl.id, song.id) in used_pairs:
            pl = choice(all_playlists)
            song = choice(all_songs)
        used_pairs.add((pl.id, song.id))
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

    print("✅ Done seeding MelodyVault with likes, notes, and added_dates!")
