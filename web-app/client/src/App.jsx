import "./App.css"
import "process/browser"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import RegistrationForm from "./Components/LoginSignup/RegistrationForm"
import LoginForm from "./Components/LoginSignup/LoginForm"
import NavBar from "./Components/NavBar"
import SearchPage from "./Components/SearchPage"
import User from "./Components/User_profile/User"
import BookPage from "./Components/BookPage/BookPage"
import PrivateRoute from "./Components/PrivateRoute"
import AudioRoom from "./Components/Stream/BookClubPage"
import StreamerMeetLayout from "./Components/Stream/StreamerMeetLayout"
import ListenerMeetLayout from "./Components/Stream/ListenerMeetLayout"
import { AudioPlayerProvider } from "./Components/BookPage/audio-player-context"
import MiniPlayer from "./Components/BookPage/mini-player"

function App() {
  return (
    <AudioPlayerProvider>
      <div className="app-container">
        <Router>
          <nav>
            <NavBar />
          </nav>
          <div className="main-content">
            <Routes>
              <Route path="/search" element={<SearchPage />} />
              <Route path="/search/:keyword" element={<SearchPage />} />
              <Route path="/signup" element={<RegistrationForm />} />
              <Route path="/login" element={<LoginForm />} />
              <Route
                path="/user"
                element={
                  <PrivateRoute>
                    <User />
                  </PrivateRoute>
                }
              />
              <Route path="/book/:id" element={<BookPage />} />
              <Route path="/stream" element={<AudioRoom />} />
              <Route path="/streamerLayout/:roomName" element={<StreamerMeetLayout />} />
              <Route path="/listenerLayout/:roomName" element={<ListenerMeetLayout />} />
            </Routes>
          </div>
          <MiniPlayer />
        </Router>
      </div>
    </AudioPlayerProvider>
  )
}

export default App
