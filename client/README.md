# 🎧 MelodyVault Client
The client is the React frontend of MelodyVault, a music playlist manager that lets users browse, create, and manage playlists and songs with a clean UI.

## ✨ Features
- 🎨 Responsive UI built with React
- 📂 Playlist Management – create and customize playlists
- 🎵 Song Management – add, view, and remove songs
- 🔗 Playlist ↔ Song Linking – connect songs to playlists dynamically
- ⚡ Real-Time Updates – instant UI changes on CRUD operations

## 🛠️ Tech Stack
- ⚛️ React (with Vite)
- 🌐 Fetch API / Axios for backend communication
- 🎨 CSS / Tailwind (optional customization)

### 🚀 Getting Started

1. Navigate to Client Folder
```
cd client
```
2. Install Dependencies
```
npm install --prefix client
```
3. Start Development Server
```
npm start --prefix client
```
- The client will now be available at:
 http://localhost:3000

- Check that your the React client displays a default page http://localhost:3000. You should see a web page with the heading "Project Client".

## 📂 Project Structure
```
├── client/
│  ├─ public/
│  │  ├─ index.html
│  │  │  └─ favicon.ico
│  ├─ src/
│  │  ├─ api/
│  │  │  └─ api.js
│  │  ├─ components/
│  │  │  ├─ FilterDropdown.js
│  │  │  ├─ Footer.js
│  │  │  ├─ NavBar.js
│  │  │  ├─ PlaylistCard.js
│  │  │  ├─ SearchBar.js
│  │  │  ├─ SongCard.js
│  ├─ context/
│  │  └─ AuthContext.js
│  │  ├─ pages/
│  │  │  ├─ AddSongToPlaylist.js
│  │  │  ├─ CreatePlaylist.js
│  │  │  ├─ Home.js
│  │  │  ├─ Login.js
│  │  │  ├─ PlaylistDetails.js
│  │  │  ├─ Playlists.js
│  │  │  ├─ Profile.js
│  │  │  ├─ SignUp.js
│  │  │  ├─ SongDetail.js
│  │  │  ├─ Songs.js
│  │  ├─ styles/
│  │  │  ├─ main.css
│  │  │  │  ├─PlaylistCard.css
│  │  ├─ App.js.js
│  │  ├─ index.js
├── .gitignore
├── package-lock.json
├── package.json
├── README.md
```
### 🧑‍💻 Development Notes
- Update API base URL in services/api.js if backend runs on a different port.
- Handle CORS errors by ensuring flask-cors is enabled on the backend.

### 🤝 Contributing
1. Fork this repository
2. Create a feature branch (git checkout -b feature-name)
3. Commit changes (git commit -m "Add feature")
4. Push to branch (git push origin feature-name)
5. Open a Pull Request


### 💡 Inspiration

Music is universal. MelodyVault is built for music lovers who want control over their playlists — simple, fast, and powerful.

### Credits
 This project was done by two brilliant individuals:
   1. Jimmy Okiwri
   2. Nicholas Kiama

We would like to thank Moringa for such a good opportuninity to do this project aand help us test the skills we gathered so far .