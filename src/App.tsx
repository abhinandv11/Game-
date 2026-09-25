import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import AppLayout from './components/AppLayout';
import HomePage from './pages/HomePage';
import GameEntryPage from './pages/GameEntryPage';
import CreateRoomPage from './pages/CreateRoomPage';
import JoinRoomPage from './pages/JoinRoomPage';
import RoomLobbyPage from './pages/RoomLobbyPage';
import GameRoomPage from './pages/GameRoomPage';
import FinalResultPage from './pages/FinalResultPage';

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/game/:gameId" element={<GameEntryPage />} />
            <Route path="/game/:gameId/create" element={<CreateRoomPage />} />
            <Route path="/game/:gameId/join" element={<JoinRoomPage />} />
            <Route path="/room/:roomId/lobby" element={<RoomLobbyPage />} />
            <Route path="/room/:roomId/play" element={<GameRoomPage />} />
            <Route path="/room/:roomId/result" element={<FinalResultPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
